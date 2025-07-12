import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "./prisma"

export const checkUser = async () => {
  const user = await currentUser()

  if (!user) {
    return null
  }

  try {
    const loggedinUser = await prisma?.user.findUnique({
      where: {
        clerkUserId: user.id
      }
    })
    if (loggedinUser) return loggedinUser

    const fullName = user.firstName ? `${user.firstName} ${user.lastName}` : user.username
    const newUser = await prisma?.user.create({
      data: {
        name: fullName,
        email: user.emailAddresses[0].emailAddress,
        clerkUserId: user.id,
        imageUrl: user.imageUrl,
        bio: "",
        experience: 0,
        skills: []
      }
    })

    return newUser
  } catch (error) {
    console.error(error)
  }
}