package dev.mfazio.tworooms.restclient.types

import com.github.salomonbrys.kotson.fromJson
import com.google.gson.*
import java.lang.reflect.Type

interface ValueObject

data class StringValueObject(val stringValue: String? = null) : ValueObject
data class IntegerValueObject(val integerValue: Int? = null) : ValueObject
data class BooleanValueObject(val booleanValue: Boolean? = null) : ValueObject
data class ArrayValueObject(val arrayValue: ValueObjectArray? = null) : ValueObject
data class ValueObjectArray(val values: List<ValueObject>) : ValueObject


class ValueObjectDeserializer : JsonDeserializer<ValueObject> {
    private val gson = Gson()

    override fun deserialize(json: JsonElement?, typeOfT: Type?, context: JsonDeserializationContext?): ValueObject {
        val jsonObject = json as JsonObject
        return if (jsonObject.has("arrayValue")) {
            jsonObject.get("arrayValue")?.asJsonObject?.let { arrayValue ->
                arrayValue.getAsJsonArray("values")?.let { values ->
                    ArrayValueObject(
                        ValueObjectArray(
                            values.map { value ->
                                convertValueObjectJsonObject(value as JsonObject)
                            }
                        )
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
}