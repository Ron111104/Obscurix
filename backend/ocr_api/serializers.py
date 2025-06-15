from rest_framework import serializers

class RedactionInputSerializer(serializers.Serializer):
    text = serializers.CharField()
    mode = serializers.ChoiceField(choices=[("strict", "strict"), ("creative", "creative")], default="strict")
