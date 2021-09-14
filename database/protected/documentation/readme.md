There are a number of ids to correlate events, from "larger" scope to smaller:

- sessionId: correlate events across different interactions by the same user for the duration of his "session"
- correlationId: correlate events across different systems for a single interaction by a user (e.g. cross-microservice)
- contextId: correlate events across different pieces of code in a single thread triggered by an interaction


Indexes:

Check current indexes:

```
select * from pg_indexes where tablename='events'
```

Create basic indexes:

```
create index events_created on events(created);
create index events_state on events(state);
create index events_event_name on events(event_name);
```