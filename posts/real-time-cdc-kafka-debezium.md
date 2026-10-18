---
title: Architecting Real-Time Change Data Capture with Kafka and Debezium
date: 2025-06-12
readTime: 6 min read
tags: ["Kafka", "Debezium", "Distributed Systems", "CDC"]
---

# Architecting Real-Time Change Data Capture with Kafka and Debezium

Keeping primary operational databases (OLTP) in sync with downstream analytical stores is one of those problems that looks simple until you run it at scale. Batch polling is the usual first attempt, and it generally hurts: it adds lock contention on the primary tables and can lag by minutes, sometimes hours.

This is how we built an event-driven **Change Data Capture (CDC)** pipeline that handles over **2,000,000 events a day** with **Apache Kafka** and **Debezium**, and the operational guardrails it needed.

---

## 1. The Architectural Challenge

In our healthcare platform, several microservices wrote to transactional SQL stores, and the downstream analytics engines and data catalogs needed near real-time visibility into those changes. Polling could not give us that without a few problems:

1. **Impact on OLTP latency**: Querying operational tables using periodic `updated_at > timestamp` polling was degrading write latency.
2. **Missing Deletes**: Polling approaches fail to reliably detect hard-deleted records unless soft-deletes with tombstones are strictly maintained across every schema.
3. **Dual-write Hazards**: Having application services write simultaneously to the database and Kafka introduces partial failure states and distributed transaction overhead.

```
[ Application Service ]
         │ (Transactions)
         ▼
[ Primary Database ] ──(Write-Ahead Log)──► [ Debezium Connector ]
                                                    │
                                                    ▼
                                            [ Kafka Cluster ]
                                                    │
                                ┌───────────────────┴───────────────────┐
                                ▼                                       ▼
                     [ Real-Time Stream Consumer ]           [ Analytical Store ]
```

---

## 2. Why Log-Based CDC?

Debezium solves this by tailing the database's **Write-Ahead Log (WAL)** or binary replication log directly. Because the WAL records every commit, rollback, and data mutation at the storage engine level:

- Mutations are captured with **zero application code changes**.
- Latency between a database commit and a Kafka message is typically **under 100 milliseconds**.
- Every update includes both the `before` and `after` row states, along with source metadata (transaction ID, timestamp, schema version).

---

## 3. Key Operational Pitfalls & Mitigations

### A. Schema Evolution & Compatibility
Databases change over time. When a column is dropped or modified in SQL, downstream consumers can break if schema management is not strictly governed.

We integrated the **Confluent Schema Registry** with **Avro serialization** to enforce **backward and forward compatibility** checks. If a migration attempted a breaking schema mutation, the connector failed cleanly at registration rather than emitting corrupt JSON payloads to topics.

### B. Kafka Partitioning & Ordering Guarantees
Kafka guarantees ordering **only within a single partition**. If updates to row ID `42` land across different partitions, consumers might process an `UPDATE` after a subsequent `DELETE`, leading to phantom state corruption.

```go
// Custom Kafka Key Routing in Consumer
type CDCEventKey struct {
    Table string `json:"table"`
    ID    string `json:"id"`
}

func GetPartitionKey(table string, primaryKey string) string {
    return fmt.Sprintf("%s:%s", table, primaryKey)
}
```

Using the primary database key as the Kafka message key routes every event for a given entity to the same partition, which keeps them in order.

### C. Lag Monitoring & Backpressure
Under bursty workloads, consumers fall behind. We watched consumer group lag (`kafka_consumergroup_lag`) in **Azure Monitor** and **Prometheus**, and used it to scale consumer pods on queue depth before latency reached our SLA.

---

## 4. Takeaways

Moving from polling to log-based CDC changed a lot:
- Reduced analytical sync lag from **~15 minutes to < 500ms**.
- Slashed operational DB read load by removing all polling queries.
- Gave us a reusable event backbone, so new consumers could subscribe to change streams without waiting on a DBA.
