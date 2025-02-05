from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Attendance, Student
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import HttpResponse



def get_attendance(request):
    data = list(Attendance.objects.values())
    return JsonResponse({'attendance': data})

# attendance/views.py



def home(request):
    """
    Render the home page.
    """
    return render(request, 'index.html')

def student_list(request):
    """
    API to get a list of all students.
    """
    students = list(Student.objects.values())
    return JsonResponse({'students': students})

def attendance_list(request):
    """
    API to get attendance records.
    """
    attendance_records = list(Attendance.objects.select_related('student').values(
        'id', 'student__name', 'student__roll_number', 'date', 'status'))
    return JsonResponse({'attendance': attendance_records})

@csrf_exempt
def add_student(request):
    """
    API to add a new student.
    """
    if request.method == 'POST':
        data = json.loads(request.body)
        name = data.get('name')
        roll_number = data.get('roll_number')
        email = data.get('email')

        if not name or not roll_number or not email:
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        student, created = Student.objects.get_or_create(
            roll_number=roll_number,
            defaults={'name': name, 'email': email}
        )

        if created:
            return JsonResponse({'message': 'Student added successfully'})
        else:
            return JsonResponse({'error': 'Student with this roll number already exists'}, status=400)

@csrf_exempt
def mark_attendance(request):
    """
    API to mark attendance for a student.
    """
    if request.method == 'POST':
        data = json.loads(request.body)
        roll_number = data.get('roll_number')
        status = data.get('status')

        if not roll_number or not status:
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        student = get_object_or_404(Student, roll_number=roll_number)
        attendance = Attendance.objects.create(student=student, status=status)

        return JsonResponse({'message': 'Attendance marked successfully', 'id': attendance.id})
