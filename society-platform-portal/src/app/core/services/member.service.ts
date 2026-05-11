import { Injectable } from '@angular/core';
import { Observable, of, timer, map, take } from 'rxjs';
import { Member } from '../models/member.model';

@Injectable({
    providedIn: 'root'
})
export class MemberService {
    private mockMembers: Member[] = [
        {
            id: 1,
            firstName: 'Amit',
            lastName: 'Shah',
            email: 'amit.shah@example.com',
            mobile: '+91 98765 43210',
            type: 'OWNER',
            role: 'UNIT_ADMIN',
            status: 'ACTIVE',
            joinedDate: '2023-10-15',
            profileImageUrl: 'assets/images/avatars/avatar-1.jpg',
            unitMapping: [{ wing: 'Wing A', flatNumber: '101' }]
        },
        {
            id: 2,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            mobile: '+91 98765 43211',
            type: 'TENANT',
            role: 'RESIDENT',
            status: 'ACTIVE',
            joinedDate: '2024-01-20',
            profileImageUrl: 'assets/images/avatars/avatar-2.jpg',
            unitMapping: [{ wing: 'Wing A', flatNumber: '102' }]
        },
        {
            id: 3,
            firstName: 'Anita',
            lastName: 'Singh',
            email: 'anita.s@example.com',
            mobile: '+91 98765 43212',
            type: 'OWNER',
            role: 'RESIDENT',
            status: 'PENDING',
            joinedDate: '2024-02-15',
            unitMapping: [{ wing: 'Wing B', flatNumber: '102' }]
        },
        {
            id: 4,
            firstName: 'Rahul',
            lastName: 'Verma',
            email: 'rahul.v@example.com',
            mobile: '+91 98765 43213',
            type: 'OWNER',
            role: 'RESIDENT',
            status: 'ACTIVE',
            joinedDate: '2022-05-10',
            unitMapping: [{ wing: 'Wing A', flatNumber: '104' }]
        },
        {
            id: 5,
            firstName: 'Sanjay',
            lastName: 'Gupta',
            email: 'sanjay.g@example.com',
            mobile: '+91 98765 43214',
            type: 'STAFF',
            role: 'STAFF',
            status: 'ACTIVE',
            joinedDate: '2023-01-05',
            staffCategory: 'Security Guard'
        }
    ];

    getMembers(): Observable<Member[]> {
        return of(this.mockMembers);
    }

    getMemberById(id: number): Observable<Member | undefined> {
        return of(this.mockMembers.find(m => m.id === id));
    }

    addMember(member: Omit<Member, 'id' | 'joinedDate'>): Observable<Member> {
        const newMember: Member = {
            ...member,
            id: Math.max(...this.mockMembers.map(m => m.id)) + 1,
            joinedDate: new Date().toISOString().split('T')[0]
        };
        this.mockMembers.push(newMember);
        return of(newMember);
    }

    updateMemberStatus(id: number, status: Member['status']): Observable<boolean> {
        const member = this.mockMembers.find(m => m.id === id);
        if (member) {
            member.status = status;
            return of(true);
        }
        return of(false);
    }

    bulkImportMembers(file: File): Observable<number> {
        return timer(0, 150).pipe(
            take(11),
            map(i => i * 10)
        );
    }

    deleteMember(id: number): Observable<boolean> {
        const index = this.mockMembers.findIndex(m => m.id === id);
        if (index > -1) {
            this.mockMembers.splice(index, 1);
            return of(true);
        }
        return of(false);
    }
}
