from django.db import models


class TanzaniaRegion(models.Model):
    name_en = models.CharField(max_length=100)
    name_sw = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    is_mainland = models.BooleanField(default=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name_en']

    def __str__(self):
        return self.name_en


class District(models.Model):
    region = models.ForeignKey(TanzaniaRegion, on_delete=models.CASCADE, related_name='districts')
    name_en = models.CharField(max_length=100)
    name_sw = models.CharField(max_length=100)
    slug = models.SlugField()

    class Meta:
        ordering = ['name_en']
        unique_together = ('region', 'slug')

    def __str__(self):
        return f"{self.name_en}, {self.region.name_en}"
