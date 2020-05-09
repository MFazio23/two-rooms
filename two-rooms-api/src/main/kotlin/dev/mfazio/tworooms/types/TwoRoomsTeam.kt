package dev.mfazio.tworooms.types

enum class TwoRoomsTeam {
    Unknown,
    Gray,
    Blue,
    Red,
    Green;

    companion object {
        fun valueOfOrDefault(input: String?) =
            values().firstOrNull { status -> status.name == input } ?: Unknown
    }
}