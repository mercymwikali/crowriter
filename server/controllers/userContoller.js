const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Fetch freelancers
const getFreelancers = asyncHandler(async (req, res) => {
    const freelancers = await prisma.user.findMany({
        where: { 
            role: "FREELANCER",
            freelancerApplications: {
                some: {
                    status: 'APPROVED'
                }
            }
        },
        select: {
            id: true,
            fname: true,
            lname: true,
            email: true,
            profilePic: true,
            role: true,
            active: true,
            online: true,
            country: true,
            city: true,
            disciplines: true,
            languages: true,
            specialization: true,
            SubmittedJobs: {
                select: {
                    id: true,
                }
            },
            payments: {
                select: {
                    amount: true,
                }
            }
        }
    });

    const freelancersWithStats = freelancers.map(freelancer => {
        const totalSubmittedJobs = freelancer.SubmittedJobs.length;
        const totalAmountPaid = freelancer.payments.reduce((sum, payment) => sum + payment.amount, 0);

        return {
            ...freelancer,
            totalSubmittedJobs,
            totalAmountPaid
        };
    });

    res.json(freelancersWithStats);
});

// Fetch freelancer details
const getFreelancerDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const freelancer = await prisma.user.findUnique({
        where: { id },
        
        include: {
            SubmittedJobs: true,
            reviews: {
                include: {
                    reviewer: {
                        select: {
                            fname: true,
                            lname: true,
                        }
                    }
                }
            },
            payments: true
        }
        
    });

    if (!freelancer) {
        res.status(404).json({ message: "Freelancer not found" });
        return;
    }

    const totalSubmittedJobs = freelancer.SubmittedJobs.length;
    const totalAmountPaid = freelancer.payments.reduce((sum, payment) => sum + payment.amount, 0);

    res.json({
        ...freelancer,
        totalSubmittedJobs,
        totalAmountPaid
    });
});

// Edit profile
const editProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { fname, lname, role, profilePic, country, city, altEmail, phone, altPhone, highestDegree, citationStyles, languages, disciplines, specialization, additionalSoftware, aboutMe } = req.body;

    const updatedUser = await prisma.user.update({
        where: { id },
        data: {
            fname,
            lname,
            role,
            profilePic,
            country,
            city,
            altEmail,
            phone,
            altPhone,
            highestDegree,
            citationStyles,
            languages,
            disciplines,
            specialization,
            additionalSoftware,
            aboutMe
        }
    });

    res.json(updatedUser);
});

// Fetch managers
const getManagers = asyncHandler(async (req, res) => {
    const managers = await prisma.user.findMany({
        where: { role: "MANAGER" },
        select: {
            id: true,
            fname: true,
            lname: true,
            email: true,
            profilePic: true,
            role: true,
            active: true,
            online: true,
            experience: true,
            leadershipStyle: true,
            teamSize: true,
            achievements: true,
            professionalDevelopment: true,
        }
    });

    res.json(managers);
});

const getUnapprovedFreelancers = asyncHandler(async (req, res) => {
    const unapprovedFreelancers = await prisma.user.findMany({
        where: {
            role: "FREELANCER",
            freelancerApplications: {
                some: {
                    status: {
                        in: ['PENDING', 'DECLINED']
                    }
                }
            }
        },
        select: {
            id: true,
            fname: true,
            lname: true,
            email: true,
            profilePic: true,
            role: true,
            active: true,
            online: true,
            country: true,
            city: true,
            disciplines: true,
            languages: true,
            specialization: true,
            freelancerApplications: {
                where: {
                    status: {
                        in: ['PENDING', 'DECLINED']
                    }
                },
                select: {
                    id: true,
                    status: true,
                    createdAt: true
                }
            }
        }
    });

    res.json(unapprovedFreelancers);
});


// Fetch manager details
const getManagerDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const manager = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            fname: true,
            lname: true,
            email: true,
            profilePic: true,
            experience: true,
            leadershipStyle: true,
            teamSize: true,
            achievements: true,
            professionalDevelopment: true,
        }
    });

    if (!manager) {
        res.status(404).json({ message: "Manager not found" });
        return;
    }

    res.json(manager);
});

module.exports = {
    getFreelancers,
    getFreelancerDetails,
    editProfile,
    getManagers,
    getManagerDetails,
    getUnapprovedFreelancers
};
