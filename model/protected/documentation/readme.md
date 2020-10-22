There are a number of ids to correlate events, from "larger" scope to smaller:

- sessionId: correlate events across different interactions by the same user for the duration of his "session"
- correlationId: correlate events across different systems for a single interaction by a user (e.g. cross-microservice)
- contextId: correlate events across different pieces of code in a single thread triggered by an interaction
- 