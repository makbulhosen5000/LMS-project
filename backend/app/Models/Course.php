<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $appends = ['course_small_image'];
    public function getCourseSmallImageAttribute()
    {
        if($this->image == null) {
            return "";
        } else {
            return asset('uploads/course/small/' . $this->image);
        }
    } 
}
