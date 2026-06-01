from django.contrib import admin
from .models import SeekerProfile, WorkExperience, Education, Skill, SeekerSkill, SeekerCV

admin.site.register(SeekerProfile)
admin.site.register(WorkExperience)
admin.site.register(Education)
admin.site.register(Skill)
admin.site.register(SeekerSkill)
admin.site.register(SeekerCV)
