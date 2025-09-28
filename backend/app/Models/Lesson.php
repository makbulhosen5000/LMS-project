<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $appends = ['video_url'];
    public function getVideoUrlAttribute()
    {
        if($this->video == null) {
            return "";
        } else {
            return asset('uploads/course/videos' . $this->video);
        }
    }
}
