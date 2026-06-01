from rest_framework import serializers
from .models import SeekerProfile, WorkExperience, Education, Skill, SeekerSkill, SeekerCV


class SeekerProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    phone_number = serializers.CharField(source='user.phone_number', read_only=True)
    region = serializers.IntegerField(source='user.region_id', read_only=True)
    region_name = serializers.CharField(source='user.region.name_en', read_only=True, default='')

    class Meta:
        model = SeekerProfile
        fields = (
            'username', 'full_name', 'phone_number', 'region', 'region_name',
            'bio', 'profile_photo', 'date_of_birth', 'gender',
            'is_discoverable', 'profile_views', 'updated_at',
        )
        read_only_fields = ('profile_views', 'updated_at')


class WorkExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkExperience
        fields = (
            'id', 'job_title', 'company_name', 'start_date', 'end_date',
            'is_current', 'description', 'created_at',
        )
        read_only_fields = ('id', 'created_at')

    def validate(self, data):
        if data.get('is_current'):
            data['end_date'] = None
        elif not data.get('end_date') and not data.get('is_current'):
            raise serializers.ValidationError({'end_date': 'Required unless this is your current job.'})
        return data


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = (
            'id', 'institution_name', 'level', 'field_of_study',
            'start_year', 'end_year', 'grade', 'created_at',
        )
        read_only_fields = ('id', 'created_at')


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ('id', 'name_en', 'name_sw')


class SeekerSkillSerializer(serializers.ModelSerializer):
    skill_id = serializers.IntegerField(write_only=True)
    skill = SkillSerializer(read_only=True)

    class Meta:
        model = SeekerSkill
        fields = ('id', 'skill', 'skill_id', 'level')
        read_only_fields = ('id',)

    def create(self, validated_data):
        skill_id = validated_data.pop('skill_id')
        try:
            skill = Skill.objects.get(pk=skill_id)
        except Skill.DoesNotExist:
            raise serializers.ValidationError({'skill_id': 'Skill not found.'})
        seeker = self.context['request'].user
        if SeekerSkill.objects.filter(seeker=seeker, skill=skill).exists():
            raise serializers.ValidationError({'skill_id': 'You already have this skill.'})
        return SeekerSkill.objects.create(seeker=seeker, skill=skill, **validated_data)


class SeekerCVSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeekerCV
        fields = ('id', 'file', 'original_filename', 'uploaded_at', 'is_primary')
        read_only_fields = ('id', 'original_filename', 'uploaded_at')

    def create(self, validated_data):
        request = self.context['request']
        file = validated_data.get('file')
        if file:
            validated_data['original_filename'] = file.name
        return SeekerCV.objects.create(seeker=request.user, **validated_data)


class DiscoverableSeekerSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    phone_number = serializers.CharField(source='user.phone_number', read_only=True)
    region_name = serializers.CharField(source='user.region.name_en', read_only=True, default='')
    skills = serializers.SerializerMethodField()
    latest_experience = serializers.SerializerMethodField()
    latest_education = serializers.SerializerMethodField()

    class Meta:
        model = SeekerProfile
        fields = (
            'username', 'full_name', 'phone_number', 'region_name',
            'bio', 'profile_photo', 'gender',
            'skills', 'latest_experience', 'latest_education',
        )

    def get_skills(self, obj):
        qs = obj.user.skills.select_related('skill').all()
        return [{'name': s.skill.name_en, 'level': s.level} for s in qs]

    def get_latest_experience(self, obj):
        exp = obj.user.work_experience.first()
        if not exp:
            return None
        return {'job_title': exp.job_title, 'company_name': exp.company_name, 'is_current': exp.is_current}

    def get_latest_education(self, obj):
        edu = obj.user.education.first()
        if not edu:
            return None
        return {'level': edu.level, 'institution_name': edu.institution_name}
