import Layout from '@/components/Layout/Layout';
import React from 'react';
import { IoAddOutline } from 'react-icons/io5';
import { useRouter } from 'next/router';

interface TeamObject {
    id: number;
    name: string;
    slates: number; // Correct plural form
}

interface TeamProp {
    team: TeamObject;
    onClick: () => void;
}

const TeamCard: React.FC<TeamProp> = ({ team, onClick }) => (
    <div
        className="box w-full h-[200px] border flex flex-col items-center justify-center text-xs text-black/65 hover:text-black bg-white cursor-pointer"
        onClick={onClick}
    >
        <p className="w-full text-center font-bold">{team.name}</p>
        <p className="w-full text-center">{team.slates} slates present in this team workspace</p>
    </div>
);

const Teams = () => {
    const router = useRouter();

    const teams: TeamObject[] = Array.from({ length: 8 }, (_, index) => ({
        id: index + 1,
        name: `Team ${index + 1}`,
        slates: 3,
    }));

    return (
        <Layout active="Teams">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4">
                <div
                    className="w-full h-[200px] border flex flex-col items-center justify-center text-xs text-black/65 hover:text-black bg-white"
                >
                    <IoAddOutline size={40} />
                    <span className="w-full inline-block text-center">Create Team</span>
                </div>
                {teams.map((team) => (
                    <TeamCard
                        key={team.id}
                        team={team}
                        onClick={() => router.push(`/dashboard/teams/${team.id}`)}
                    />
                ))}
            </div>
        </Layout>
    );
};

export default Teams;
