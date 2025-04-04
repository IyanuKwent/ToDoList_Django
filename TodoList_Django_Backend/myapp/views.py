from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, viewsets
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-id')  
    serializer_class = TaskSerializer


    @action(detail=True, methods=['put'])
    def toggle(self, request, pk=None):
        try:
            task = self.get_object() 
            task.completed = not task.completed  
            task.save()  
            return Response(TaskSerializer(task).data, status=status.HTTP_200_OK)
        except Task.DoesNotExist:
            return Response({"detail": "Task not found."}, status=status.HTTP_404_NOT_FOUND)
