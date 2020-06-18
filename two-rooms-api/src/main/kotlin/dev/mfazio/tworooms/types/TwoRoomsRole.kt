package dev.mfazio.tworooms.types

import dev.mfazio.tworooms.restclient.types.ArrayValueObject
import dev.mfazio.tworooms.restclient.types.StringValueObject

enum class TwoRoomsRole(val isRequired: Boolean = false, val requiredTeam: TwoRoomsTeam? = null) {
    Unknown,
    President(true, TwoRoomsTeam.Blue),
    Bomber(true, TwoRoomsTeam.Red),
    BlueTeam(true, TwoRoomsTeam.Blue),
    RedTeam(true, TwoRoomsTeam.Red),
    Gambler(true, TwoRoomsTeam.Gray),
    Angel,
    Blind,
    Clown,
    Demon,
    Mime,
    Rival,
    ShyGuy,
    Survivor;

    companion object {
        fun valueOfOrDefault(input: String?) =
            values().firstOrNull { role -> role.name.equals(input, true) } ?: Unknown

        fun fromArrayValueObject(arrayValueObject: ArrayValueObject?): List<TwoRoomsRole> =
            arrayValueObject?.arrayValue?.values?.map { it as StringValueObject }?.map {
                valueOfOrDefault(it.stringValue)
            } ?: emptyList()

        fun fromMap(roles: Map<String, Boolean>): List<TwoRoomsRole> =
            roles
                .filter { (_, isActive) -> isActive }
                .map { (roleName, _) ->
                    valueOfOrDefault(roleName)
                }
                .filter { it != Unknown }
    }
}