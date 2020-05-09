package dev.mfazio.tworooms.types

import dev.mfazio.tworooms.restclient.types.ArrayValueObject
import dev.mfazio.tworooms.restclient.types.StringValueObject

enum class TwoRoomsRole(val requiredTeam: TwoRoomsTeam? = null) {
    Unknown,
    President(TwoRoomsTeam.Blue),
    Bomber(TwoRoomsTeam.Red),
    BlueTeam(TwoRoomsTeam.Blue),
    RedTeam(TwoRoomsTeam.Red),
    Gambler(TwoRoomsTeam.Gray),
    Angel,
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