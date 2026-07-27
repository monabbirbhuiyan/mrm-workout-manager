import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

function uid() {
  return Math.random().toString(36).slice(2, 11)
}

async function main() {
  // Clear existing data
  await db.workoutSet.deleteMany()
  await db.workout.deleteMany()
  await db.routineDayExercise.deleteMany()
  await db.routineDay.deleteMany()
  await db.routine.deleteMany()
  await db.exercise.deleteMany()
  await db.userSetting.deleteMany()

  // Seed comprehensive exercises
  const exerciseData = [
    // CHEST
    { name: 'Barbell Bench Press', muscleGroup: 'Chest' },
    { name: 'Incline Bench Press', muscleGroup: 'Chest' },
    { name: 'Dumbbell Bench Press', muscleGroup: 'Chest' },
    { name: 'Incline Dumbbell Press', muscleGroup: 'Chest' },
    { name: 'Dumbbell Fly', muscleGroup: 'Chest' },
    { name: 'Cable Fly', muscleGroup: 'Chest' },
    { name: 'Push Up', muscleGroup: 'Chest' },
    { name: 'Machine Chest Press', muscleGroup: 'Chest' },
    { name: 'Pec Deck', muscleGroup: 'Chest' },
    { name: 'Chest Dips', muscleGroup: 'Chest' },

    // BACK
    { name: 'Barbell Deadlift', muscleGroup: 'Back' },
    { name: 'Barbell Row', muscleGroup: 'Back' },
    { name: 'Dumbbell Row', muscleGroup: 'Back' },
    { name: 'Pull Up', muscleGroup: 'Back' },
    { name: 'Chin Up', muscleGroup: 'Back' },
    { name: 'Lat Pulldown', muscleGroup: 'Back' },
    { name: 'Cable Row', muscleGroup: 'Back' },
    { name: 'T-Bar Row', muscleGroup: 'Back' },
    { name: 'Face Pull', muscleGroup: 'Back' },
    { name: 'Hyperextension', muscleGroup: 'Back' },

    // SHOULDERS
    { name: 'Overhead Press', muscleGroup: 'Shoulders' },
    { name: 'Dumbbell Overhead Press', muscleGroup: 'Shoulders' },
    { name: 'Lateral Raise', muscleGroup: 'Shoulders' },
    { name: 'Front Raise', muscleGroup: 'Shoulders' },
    { name: 'Rear Delt Fly', muscleGroup: 'Shoulders' },
    { name: 'Arnold Press', muscleGroup: 'Shoulders' },
    { name: 'Machine Shoulder Press', muscleGroup: 'Shoulders' },
    { name: 'Upright Row', muscleGroup: 'Shoulders' },
    { name: 'Barbell Shrugs', muscleGroup: 'Shoulders' },
    { name: 'Dumbbell Shrugs', muscleGroup: 'Shoulders' },

    // BICEPS
    { name: 'Barbell Curl', muscleGroup: 'Biceps' },
    { name: 'Dumbbell Curl', muscleGroup: 'Biceps' },
    { name: 'Hammer Curl', muscleGroup: 'Biceps' },
    { name: 'Preacher Curl', muscleGroup: 'Biceps' },
    { name: 'Cable Curl', muscleGroup: 'Biceps' },
    { name: 'Concentration Curl', muscleGroup: 'Biceps' },

    // TRICEPS
    { name: 'Tricep Pushdown', muscleGroup: 'Triceps' },
    { name: 'Overhead Tricep Extension', muscleGroup: 'Triceps' },
    { name: 'Skull Crusher', muscleGroup: 'Triceps' },
    { name: 'Close Grip Bench', muscleGroup: 'Triceps' },
    { name: 'Dumbbell Kickback', muscleGroup: 'Triceps' },
    { name: 'Tricep Dips', muscleGroup: 'Triceps' },

    // LEGS
    { name: 'Barbell Squat', muscleGroup: 'Legs' },
    { name: 'Front Squat', muscleGroup: 'Legs' },
    { name: 'Leg Press', muscleGroup: 'Legs' },
    { name: 'Leg Extension', muscleGroup: 'Legs' },
    { name: 'Leg Curl', muscleGroup: 'Legs' },
    { name: 'Romanian Deadlift', muscleGroup: 'Legs' },
    { name: 'Calf Raise', muscleGroup: 'Legs' },
    { name: 'Hack Squat', muscleGroup: 'Legs' },
    { name: 'Bulgarian Split Squat', muscleGroup: 'Legs' },
    { name: 'Goblet Squat', muscleGroup: 'Legs' },
    { name: 'Walking Lunge', muscleGroup: 'Legs' },

    // GLUTES
    { name: 'Barbell Hip Thrust', muscleGroup: 'Glutes' },
    { name: 'Glute Bridge', muscleGroup: 'Glutes' },
    { name: 'Cable Pull Through', muscleGroup: 'Glutes' },

    // CORE
    { name: 'Plank', muscleGroup: 'Core' },
    { name: 'Cable Crunch', muscleGroup: 'Core' },
    { name: 'Hanging Leg Raise', muscleGroup: 'Core' },
    { name: 'Russian Twist', muscleGroup: 'Core' },
    { name: 'Ab Wheel Rollout', muscleGroup: 'Core' },
    { name: 'Dead Bug', muscleGroup: 'Core' },

    // CARDIO
    { name: 'Jump Rope', muscleGroup: 'Cardio' },
    { name: 'Burpee', muscleGroup: 'Cardio' },
    { name: 'Mountain Climber', muscleGroup: 'Core' },
    { name: 'Jumping Jack', muscleGroup: 'Cardio' },
    { name: 'High Knees', muscleGroup: 'Cardio' },

    // FULL BODY
    { name: 'Power Clean', muscleGroup: 'Full Body' },
    { name: 'Snatch', muscleGroup: 'Full Body' },
    { name: 'Kettlebell Swing', muscleGroup: 'Glutes' },
    { name: 'Thruster', muscleGroup: 'Full Body' },
    { name: 'Turkish Get Up', muscleGroup: 'Full Body' },
    { name: 'Man Maker', muscleGroup: 'Full Body' },
  ]

  const exIds: Record<string, string> = {}
  for (const e of exerciseData) {
    const id = uid()
    exIds[e.name] = id
    await db.exercise.create({ data: { id, ...e } })
  }

  // Create routine
  const routineId = uid()
  await db.routine.create({
    data: {
      id: routineId,
      name: '5-Day Hypertrophy Split',
      description: 'Push/Pull/Legs split optimized for muscle growth',
      isActive: true,
    },
  })

  // Helper to create a day with exercises
  async function createDay(title: string, focus: string, order: number, exercises: { name: string; sets: number; reps: number; rest: number }[]) {
    const dayId = uid()
    await db.routineDay.create({ data: { id: dayId, routineId, title, focus, order } })
    for (let i = 0; i < exercises.length; i++) {
      const e = exercises[i]
      await db.routineDayExercise.create({
        data: {
          id: uid(),
          routineDayId: dayId,
          exerciseId: exIds[e.name],
          targetSets: e.sets,
          targetReps: e.reps,
          restSeconds: e.rest,
          order: i + 1,
        },
      })
    }
    return dayId
  }

  // Day 1: Push A
  await createDay('Day 1: Push A', 'Chest / Shoulders / Triceps', 1, [
    { name: 'Barbell Bench Press', sets: 4, reps: 8, rest: 120 },
    { name: 'Incline Dumbbell Press', sets: 3, reps: 10, rest: 90 },
    { name: 'Cable Fly', sets: 3, reps: 12, rest: 60 },
    { name: 'Dumbbell Overhead Press', sets: 3, reps: 10, rest: 90 },
    { name: 'Lateral Raise', sets: 3, reps: 15, rest: 60 },
    { name: 'Tricep Pushdown', sets: 3, reps: 12, rest: 60 },
  ])

  // Day 2: Pull B
  await createDay('Day 2: Pull B', 'Back / Biceps', 2, [
    { name: 'Barbell Deadlift', sets: 4, reps: 5, rest: 180 },
    { name: 'Barbell Row', sets: 4, reps: 8, rest: 120 },
    { name: 'Pull Up', sets: 3, reps: 8, rest: 90 },
    { name: 'Cable Row', sets: 3, reps: 10, rest: 90 },
    { name: 'Face Pull', sets: 3, reps: 15, rest: 60 },
    { name: 'Barbell Curl', sets: 3, reps: 10, rest: 60 },
    { name: 'Hammer Curl', sets: 3, reps: 12, rest: 60 },
  ])

  // Day 3: Leg Day C
  await createDay('Day 3: Leg Day', 'Quads / Hamstrings / Glutes', 3, [
    { name: 'Barbell Squat', sets: 4, reps: 8, rest: 150 },
    { name: 'Romanian Deadlift', sets: 4, reps: 10, rest: 120 },
    { name: 'Leg Press', sets: 3, reps: 12, rest: 90 },
    { name: 'Leg Curl', sets: 3, reps: 12, rest: 60 },
    { name: 'Barbell Hip Thrust', sets: 3, reps: 12, rest: 90 },
    { name: 'Calf Raise', sets: 4, reps: 15, rest: 60 },
  ])

  // Day 4: Push D
  await createDay('Day 4: Push D', 'Volume / Accessory', 4, [
    { name: 'Overhead Press', sets: 4, reps: 8, rest: 120 },
    { name: 'Incline Dumbbell Press', sets: 3, reps: 10, rest: 90 },
    { name: 'Lateral Raise', sets: 4, reps: 15, rest: 60 },
    { name: 'Cable Fly', sets: 3, reps: 12, rest: 60 },
    { name: 'Overhead Tricep Extension', sets: 3, reps: 12, rest: 60 },
  ])

  // Day 5: Pull E
  await createDay('Day 5: Pull E', 'Deadlift / Rear Delt', 5, [
    { name: 'Barbell Deadlift', sets: 4, reps: 5, rest: 180 },
    { name: 'Lat Pulldown', sets: 3, reps: 10, rest: 90 },
    { name: 'Cable Row', sets: 3, reps: 10, rest: 90 },
    { name: 'Face Pull', sets: 4, reps: 15, rest: 60 },
    { name: 'Barbell Curl', sets: 3, reps: 10, rest: 60 },
    { name: 'Hammer Curl', sets: 3, reps: 12, rest: 60 },
  ])

  // Seed sample completed workouts
  const now = Date.now()
  const sampleWorkouts = [
    { name: 'Push Day A', daysAgo: 3, duration: 3120, volume: 15200, sets: 16, completed: 14 },
    { name: 'Pull Day B', daysAgo: 2, duration: 2880, volume: 14800, sets: 20, completed: 18 },
    { name: 'Leg Day C', daysAgo: 5, duration: 3660, volume: 18400, sets: 18, completed: 17 },
    { name: 'Push Day D', daysAgo: 7, duration: 2700, volume: 12600, sets: 15, completed: 13 },
    { name: 'Pull Day E', daysAgo: 8, duration: 3000, volume: 16200, sets: 18, completed: 16 },
    { name: 'Push Day A', daysAgo: 10, duration: 3300, volume: 14400, sets: 16, completed: 15 },
    { name: 'Pull Day B', daysAgo: 12, duration: 2940, volume: 13800, sets: 20, completed: 19 },
    { name: 'Leg Day C', daysAgo: 14, duration: 3480, volume: 17600, sets: 18, completed: 16 },
  ]

  for (const w of sampleWorkouts) {
    const started = new Date(now - w.daysAgo * 24 * 60 * 60 * 1000)
    const completed = new Date(now - w.daysAgo * 24 * 60 * 60 * 1000 + w.duration * 1000)
    await db.workout.create({
      data: {
        name: w.name,
        startedAt: started,
        completedAt: completed,
        durationSeconds: w.duration,
        totalVolume: w.volume,
        totalSets: w.sets,
        completedSets: w.completed,
      },
    })
  }

  // Seed default settings
  const settings = [
    { key: 'userName', value: 'User' },
    { key: 'restTimerAutoStart', value: 'true' },
    { key: 'audioAlerts', value: 'true' },
    { key: 'highContrast', value: 'false' },
    { key: 'restTimerDuration', value: '60' },
  ]
  for (const s of settings) {
    await db.userSetting.create({ data: s })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
