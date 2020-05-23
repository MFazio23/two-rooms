package dev.mfazio.tworooms.types

enum class GameStatus {
    Unknown,
    Created,
    Started,
    Ended,
    Canceled,
    Error;

    companion object {
        fun valueOfOrDefault(input: String?) =
            values().firstOrNull { status -> status.name == input } ?: Unknown
    }
}