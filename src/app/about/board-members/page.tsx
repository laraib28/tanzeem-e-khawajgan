import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Linkedin, Twitter } from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from '@/components/ui/breadcrumb'

interface Member {
  name: string;
  position: string;
  bio: string;
  avatar: string;
  social: {
    twitter?: string;
    linkedin?: string;
  };
}

const boardMembers: Member[] = [
  { name: 'Mr. ABC', position: 'President', bio: 'Leading with vision and dedication.', avatar: '/logo.jpg', social: {} },
  { name: 'Mr. ABC', position: 'Vice President', bio: 'Supporting the mission with passion.', avatar: '/logo.jpg', social: {} },
  { name: 'Mr. ABC', position: 'General Secretary', bio: 'Ensuring smooth operations.', avatar: '/logo.jpg', social: {} },
  { name: 'Mr. ABC', position: 'Treasurer', bio: 'Managing finances with integrity.', avatar: '/logo.jpg', social: {} },
  { name: 'Mr. ABC', position: 'Board Member', bio: 'Contributing to strategic decisions.', avatar: '/logo.jpg', social: {} },
  { name: 'Mr. ABC', position: 'Board Member', bio: 'A dedicated member of the team.', avatar: '/logo.jpg', social: {} },
];

const BoardMembersPage = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                    <BreadcrumbLink href="/about">About</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                    <BreadcrumbPage>Board of Members</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
          <h1 className="text-5xl font-bold text-primary text-center mt-8">Board of Members</h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mt-4">
            Meet the dedicated leaders guiding our organization towards its mission and vision.
          </p>
        </div>
      </section>

      {/* Board Members Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {boardMembers.map((member) => (
              <Card key={member.name} className="overflow-hidden hover:shadow-xl transition-shadow border-t-4 border-secondary">
                <CardHeader className="flex flex-col items-center text-center p-6">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-2xl text-primary">{member.name}</CardTitle>
                  <p className="text-secondary font-semibold">{member.position}</p>
                </CardHeader>
                <CardContent className="text-center px-6 pb-6">
                  <p className="text-gray-700">{member.bio}</p>
                  <div className="flex justify-center gap-4 mt-4">
                    {member.social.twitter && (
                      <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary">
                        <Twitter />
                      </a>
                    )}
                    {member.social.linkedin && (
                      <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary">
                        <Linkedin />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BoardMembersPage;