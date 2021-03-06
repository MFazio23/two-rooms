package dev.mfazio.tworooms.types

import kotlinx.serialization.Serializable

@Serializable
enum class TwoRoomsTeam {
    Unknown,
    Gray,
    Blue,
    Red,
    Green;

    companion object {
        fun valueOfOrDefault(input: String?) =
            values().firstOrNull { status -> status.name == input } ?: Unknown

        fun fromStringList(list: List<String>) =
            list.map { teamString -> TwoRoomsTeam.valueOfOrDefault(teamString) }
    }
}