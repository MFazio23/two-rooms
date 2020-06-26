package dev.mfazio.tworooms.restclient.types

import kotlinx.serialization.*
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonConfiguration
import kotlinx.serialization.json.JsonInput
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

object ValueObjectSerializer : KSerializer<ValueObject> {
    override val descriptor: SerialDescriptor
        get() = SerialDescriptor("ValueObject")

    override fun deserialize(decoder: Decoder): ValueObject {
        val input = decoder as? JsonInput ?: throw SerializationException("JsonInput could not be loaded properly.")
        val obj = input.decodeJson() as? JsonObject ?: throw SerializationException("Expected a JsonObject")

        return if (obj.containsKey("arrayValue")) {
            val valueObjects = obj.getObjectOrNull("arrayValue")?.getArrayOrNull("values")?.map {
                convertValueObjectJsonObject(input.json, it.jsonObject)
            }

            if(valueObjects != null) {
                ArrayValueObject(ValueObjectArray(valueObjects))
            } else throw SerializationException("ArrayValue cannot be parsed correctly.")
        } else convertValueObjectJsonObject(input.json, obj)
    }

    override fun serialize(encoder: Encoder, value: ValueObject) {
        when (value) {
            is StringValueObject -> encoder.encode(StringValueObject.serializer(), value)
            is IntegerValueObject -> encoder.encode(IntegerValueObject.serializer(), value)
            is BooleanValueObject -> encoder.encode(BooleanValueObject.serializer(), value)
            is ArrayValueObject -> encoder.encode(ArrayValueObject.serializer(), value)
            is ValueObjectArray -> encoder.encode(ValueObjectArray.serializer(), value)
            else -> println("Nope")
        }
    }

    private fun convertValueObjectJsonObject(json: Json, jsonObject: JsonObject) = when {
        jsonObject.containsKey("stringValue") -> json.fromJson(StringValueObject.serializer(), jsonObject)
        jsonObject.containsKey("integerValue") -> json.fromJson(IntegerValueObject.serializer(), jsonObject)
        jsonObject.containsKey("booleanValue") -> json.fromJson(BooleanValueObject.serializer(), jsonObject)
        else -> throw SerializationException("Cannot find the ValueObject type: [${jsonObject}]")
    }

}
