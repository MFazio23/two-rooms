package dev.mfazio.tworooms.restclient.types

import dev.mfazio.tworooms.types.TwoRoomsRole
import dev.mfazio.tworooms.types.TwoRoomsTeam
import kotlinx.serialization.*
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.modules.SerializersModule

@Polymorphic
@Serializable(with = ValueObjectSerializer::class)
interface ValueObject {
    companion object {
        val valueObjectModule = SerializersModule {
            polymorphic(ValueObject::class) {
                StringValueObject::class with StringValueObject.serializer()
                IntegerValueObject::class with IntegerValueObject.serializer()
                BooleanValueObject::class with BooleanValueObject.serializer()
                ArrayValueObject::class with ArrayValueObject.serializer()
                ValueObjectArray::class with ValueObjectArray.serializer()
            }
        }
    }
}

@Serializable data class StringValueObject(val stringValue: String? = null) : ValueObject
@Serializable data class IntegerValueObject(val integerValue: Int? = null) : ValueObject
@Serializable data class BooleanValueObject(val booleanValue: Boolean? = null) : ValueObject
@Serializable data class ArrayValueObject(val arrayValue: ValueObjectArray? = null) : ValueObject
@Serializable data class ValueObjectArray(val values: List<ValueObject>) : ValueObject

object ValueObjectSerializer: KSerializer<ValueObject> {
    override val descriptor: SerialDescriptor
        get() = SerialDescriptor("ValueObject")

    override fun deserialize(decoder: Decoder): ValueObject {
        println()

        return StringValueObject()
    }

    override fun serialize(encoder: Encoder, value: ValueObject) {
        when(value) {
            is StringValueObject -> encoder.encode(StringValueObject.serializer(), value)
            is IntegerValueObject -> encoder.encode(IntegerValueObject.serializer(), value)
            is BooleanValueObject -> encoder.encode(BooleanValueObject.serializer(), value)
            is ArrayValueObject -> encoder.encode(ArrayValueObject.serializer(), value)
            is ValueObjectArray -> encoder.encode(ValueObjectArray.serializer(), value)
            else -> println("Nope")
        }
    }

}

/*
class ValueObjectDeserializer : JsonDeserializer<ValueObject> {
    private val gson = Gson()

    override fun deserialize(json: JsonElement?, typeOfT: Type?, context: JsonDeserializationContext?): ValueObject {
        val jsonObject = json as JsonObject
        return if (jsonObject.has("arrayValue")) {
            jsonObject.get("arrayValue")?.asJsonObject?.let { arrayValue ->
                if(arrayValue.has("values")) {
                    arrayValue.getAsJsonArray("values")?.let { values ->
                        ArrayValueObject(
                            ValueObjectArray(
                                values.map { value ->
                                    convertValueObjectJsonObject(value as JsonObject)
                                }
                            )
                        )
                    }
                } else {
                    ArrayValueObject(
                        ValueObjectArray(listOf())
                    )
                }
            } ?: throw JsonParseException("Cannot parse the ArrayValueObject")
        } else {
            convertValueObjectJsonObject(jsonObject)
        }
    }

    private fun convertValueObjectJsonObject(jsonObject: JsonObject) = when {
        jsonObject.has("stringValue") -> gson.fromJson<StringValueObject>(jsonObject)
        jsonObject.has("integerValue") -> gson.fromJson<IntegerValueObject>(jsonObject)
        jsonObject.has("booleanValue") -> gson.fromJson<BooleanValueObject>(jsonObject)
        else -> throw JsonParseException("Cannot find the ValueObject type: [${jsonObject}]")
    }
}*/

fun main() {
    val json = Json(context = ValueObject.valueObjectModule)
    val body = """
        {
          "name": "projects/tworooms-66ba8/databases/(default)/documents/games/LWSGZK",
          "fields": {
            "gameCode": {
              "stringValue": "LWSGZK"
            },
            "roles": {
              "arrayValue": {
                "values": [
                  {
                    "stringValue": "President"
                  },
                  {
                    "stringValue": "Bomber"
                  },
                  {
                    "stringValue": "BlueTeam"
                  },
                  {
                    "stringValue": "RedTeam"
                  },
                  {
                    "stringValue": "Gambler"
                  },
                  {
                    "stringValue": "Clown"
                  },
                  {
                    "stringValue": "Angel"
                  },
                  {
                    "stringValue": "Demon"
                  },
                  {
                    "stringValue": "Survivor"
                  }
                ]
              }
            },
            "ownerUID": {
              "stringValue": "4Yz9C8pgq7Yl8FjPghwZ6mFC97G3"
            },
            "status": {
              "stringValue": "Created"
            }
          },
          "createTime": "2020-05-12T03:46:22.501467Z",
          "updateTime": "2020-05-12T03:46:22.501467Z"
        }

    """.trimIndent()

    val vObj = json.parse(FirebaseDocument.serializer(), body)

    println(vObj)
}
