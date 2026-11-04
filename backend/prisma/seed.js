
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const services = [
    {
        id: "10000000-0000-4000-8000-000000000001",
        name: "Мужская стрижка",
        description: "Классическая мужская стрижка",
        price: 45,
        duration: 60
    },
    {
        id: "10000000-0000-4000-8000-000000000002",
        name: "Стрижка бороды",
        description: "Моделирование и оформление бороды",
        price: 25,
        duration: 30
    },
    {
        id: "10000000-0000-4000-8000-000000000003",
        name: "Комплекс",
        description: "Стрижка волос и оформление бороды",
        price: 60,
        duration: 90
    },
    {
        id: "10000000-0000-4000-8000-000000000004",
        name: "Королевское бритьё",
        description: "Традиционное бритьё опасной бритвой",
        price: 35,
        duration: 45
    }
];

const masters = [
    {
        id: "20000000-0000-4000-8000-000000000001",
        name: "Александр",
        position: "Топ-барбер",
        experienceYears: 7
    },
    {
        id: "20000000-0000-4000-8000-000000000002",
        name: "Максим",
        position: "Барбер",
        experienceYears: 5
    },
    {
        id: "20000000-0000-4000-8000-000000000003",
        name: "Дмитрий",
        position: "Барбер",
        experienceYears: 3
    }
];

async function main() {
    console.log("Starting database seeding...");

    for (const service of services) {
        await prisma.service.upsert({
            where: { id: service.id },
            update: service,
            create: service
        });
    }

    console.log(`Services added: ${services.length}`);

    for (const master of masters) {
        await prisma.master.upsert({
            where: { id: master.id },
            update: master,
            create: master
        });
    }

    console.log(`Masters added: ${masters.length}`);

    console.log("Database seeding completed!");
}

main()
    .catch((error) => {
        console.error("Seeding failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
