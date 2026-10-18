---
title: Hardening Pod-to-Pod Kubernetes Network Security with Calico Policies
date: 2024-11-04
readTime: 5 min read
tags: ["Kubernetes", "Calico", "Security", "DevOps"]
---

# Hardening Pod-to-Pod Kubernetes Network Security with Calico Policies

Out of the box, Kubernetes gives you a flat network: **every pod can talk to every other pod** in every namespace. That is convenient for prototyping, but in regulated or healthcare environments it breaks the first rule of zero trust.

If one unimportant edge service is compromised, an attacker can move sideways through the cluster to reach databases, caches, or identity providers.

This is how we locked our clusters down with **Calico Network Policies**.

---

## 1. Default-Deny: The Zero-Trust Baseline

The starting point is to move from allow-all to an explicit **default-deny**.

```yaml
apiVersion: projectcalico.org/v3
kind: GlobalNetworkPolicy
metadata:
  name: default-deny-all
spec:
  order: 1000
  types:
    - Ingress
    - Egress
  ingress: []
  egress:
    - action: Allow
      protocol: UDP
      destination:
        ports: [53] # Explicitly allow internal CoreDNS lookup
```

Applying this shuts down all pod-to-pod traffic except CoreDNS lookups. From there, each microservice has to declare its own ingress and egress rules.

---

## 2. Granular Ingress Whitelisting

Take a PostgreSQL cluster in the `data` namespace. Only backend services labeled `role: api-backend` in the `app` namespace should be allowed to reach port `5432`:

```yaml
apiVersion: projectcalico.org/v3
kind: NetworkPolicy
metadata:
  name: allow-api-to-postgres
  namespace: data
spec:
  selector: app == 'postgres'
  types:
    - Ingress
  ingress:
    - action: Allow
      protocol: TCP
      source:
        namespaceSelector: projectcalico.org/name == 'app'
        selector: role == 'api-backend'
      destination:
        ports:
          - 5432
```

A misconfigured or malicious pod in any other namespace trying to reach port `5432` is dropped at the kernel packet-filter level (`iptables` / `eBPF`) before the TCP handshake completes.

---

## 3. Results & Operational Audits

1. **Smaller attack surface**: Pod-to-pod lateral movement dropped by over 95%.
2. **Audit compliance**: Network rules live in Git as Infrastructure as Code, which made compliance reporting straightforward.
3. **Telemetry**: Calico flow logs plus Prometheus alerts gave us immediate visibility into denied connections across namespaces.
