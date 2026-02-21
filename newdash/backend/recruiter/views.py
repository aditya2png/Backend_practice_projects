from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Recruiter
from recruiter.serializer import RecruiterManagementSerializer

class RecruiterListCreateView(APIView):
    def get(self, request):
        recruiters = Recruiter.objects.all()
        serializer = RecruiterManagementSerializer(recruiters, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = RecruiterManagementSerializer(data=request.data)
        if serializer.is_valid():
            # HARDCODED: We use admin_id=1 directly. 
            # This skips the "No User found" error by assuming ID 1 exists.
            try:
                serializer.save(
                    admin_id='550e8400-e29b-41d4-a716-446655440000', 
                    interviews_scheduled=0, 
                    interviews_completed=0
                )
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                # This will catch if ID 1 actually doesn't exist in the DB
                return Response(
                    {"error": "Database error. Make sure a User with ID 1 exists.", "details": str(e)}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class RecruiterDetailedList(APIView):

    def get(self,request,pk):
        recruiter = Recruiter.objects.get(pk=pk)
        serializer = RecruiterManagementSerializer(recruiter)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    def delete(self, request, pk):
        try:
            recruiter = Recruiter.objects.get(pk=pk)
            recruiter.delete()
            return Response(
                {"message": "Deleted successfully"}, 
                status=status.HTTP_204_NO_CONTENT
            )
        except Recruiter.DoesNotExist:
            return Response(
                {"error": "Recruiter not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )