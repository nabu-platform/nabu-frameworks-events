Because both the classification and notification work on the state, we need to index that:

```sql
create index idx_event_state on events(state)
```

The default management screen sorts on created:

```sql
create index idx_events_created on events(created)
```

Queries require indexes but can occur in any combination, making it slightly trickier

```sql
create index idx_events_name on events(event_name)
```

On artifact id:

```sql
create index idx_events_artifact_id on events(artifact_id);
```



Classification filter? Might not be useful because we do a null-check.

```sql
create index idx_event_classification on events(classification);
```