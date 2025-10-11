<?php

namespace App\Policies;

use App\Models\Complaints;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ComplaintsPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the complaint.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Complaints  $complaints
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Complaints $complaints)
    {
        // Users can only view their own complaints or admins/officers can view any complaint
        return $user->id === $complaints->user_id || in_array($user->role, ['admin', 'officer']);
    }

    /**
     * Determine whether the user can update the complaint.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Complaints  $complaints
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Complaints $complaints)
    {
        // Users can only update their own complaints if they're in pending status
        return $user->id === $complaints->user_id && $complaints->status === 'pending';
    }

    /**
     * Determine whether the user can delete the complaint.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Complaints  $complaints
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Complaints $complaints)
    {
        // Users can only delete their own complaints if they're in pending status
        return $user->id === $complaints->user_id && $complaints->status === 'pending';
    }
}
