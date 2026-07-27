export type MuscleGroup = "chest" | "back" | "shoulders" | "biceps" | "triceps" | "legs" | "glutes" | "core" | "cardio" | "full_body";
export type Equipment = "barbell" | "dumbbell" | "machine" | "cable" | "bodyweight" | "kettlebell" | "band" | "other";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface ExerciseDefinition {
  id: string;
  name: string;
  muscles: MuscleGroup[];
  equipment: Equipment;
  difficulty: Difficulty;
  description: string;
  imageKey: string;
}

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  chest: "Chest",
  back: "Back",
  shoulders: "Shoulders",
  biceps: "Biceps",
  triceps: "Triceps",
  legs: "Legs",
  glutes: "Glutes",
  core: "Core",
  cardio: "Cardio",
  full_body: "Full Body",
};

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  barbell: "Barbell",
  dumbbell: "Dumbbell",
  machine: "Machine",
  cable: "Cable",
  bodyweight: "Bodyweight",
  kettlebell: "Kettlebell",
  band: "Resistance Band",
  other: "Other",
};

export const EXERCISE_LIBRARY: ExerciseDefinition[] = [
  // CHEST
  { id: "bench_press", name: "Barbell Bench Press", muscles: ["chest"], equipment: "barbell", difficulty: "intermediate", description: "Lie on bench, lower bar to chest, press up.", imageKey: "barbell_bench_press" },
  { id: "incline_bench", name: "Incline Bench Press", muscles: ["chest", "shoulders"], equipment: "barbell", difficulty: "intermediate", description: "Press at 30-45° incline to target upper chest.", imageKey: "incline_bench_press" },
  { id: "db_bench", name: "Dumbbell Bench Press", muscles: ["chest"], equipment: "dumbbell", difficulty: "beginner", description: "Press dumbbells from chest level upward.", imageKey: "dumbbell_bench_press" },
  { id: "db_incline_bench", name: "Incline Dumbbell Press", muscles: ["chest", "shoulders"], equipment: "dumbbell", difficulty: "intermediate", description: "Incline press with dumbbells for upper chest.", imageKey: "incline_dumbbell_press" },
  { id: "chest_fly", name: "Dumbbell Fly", muscles: ["chest"], equipment: "dumbbell", difficulty: "beginner", description: "Arms wide, squeeze chest to bring dumbbells together.", imageKey: "dumbbell_fly" },
  { id: "cable_fly", name: "Cable Fly", muscles: ["chest"], equipment: "cable", difficulty: "intermediate", description: "Cable crossover or single-arm fly.", imageKey: "cable_fly" },
  { id: "push_up", name: "Push Up", muscles: ["chest", "triceps"], equipment: "bodyweight", difficulty: "beginner", description: "Standard push up. Progress with decline or weighted.", imageKey: "push_up" },
  { id: "machine_chest_press", name: "Machine Chest Press", muscles: ["chest"], equipment: "machine", difficulty: "beginner", description: "Seated machine press. Easy to load heavy.", imageKey: "machine_chest_press" },
  { id: "pec_deck", name: "Pec Deck", muscles: ["chest"], equipment: "machine", difficulty: "beginner", description: "Isolation machine fly for chest.", imageKey: "pec_deck" },
  { id: "chest_dips", name: "Chest Dips", muscles: ["chest", "triceps"], equipment: "bodyweight", difficulty: "intermediate", description: "Lean forward on parallel bars to target chest.", imageKey: "dips" },

  // BACK
  { id: "deadlift", name: "Barbell Deadlift", muscles: ["back", "glutes", "legs"], equipment: "barbell", difficulty: "advanced", description: "Hinge at hips, lift bar from floor. King of back exercises.", imageKey: "deadlift" },
  { id: "bb_row", name: "Barbell Row", muscles: ["back"], equipment: "barbell", difficulty: "intermediate", description: "Bend over, row barbell to lower chest.", imageKey: "barbell_row" },
  { id: "db_row", name: "Dumbbell Row", muscles: ["back"], equipment: "dumbbell", difficulty: "beginner", description: "One arm row with dumbbell, support on bench.", imageKey: "dumbbell_row" },
  { id: "pull_up", name: "Pull Up", muscles: ["back"], equipment: "bodyweight", difficulty: "intermediate", description: "Overhand grip pull up. Add weight as needed.", imageKey: "pull_up" },
  { id: "chin_up", name: "Chin Up", muscles: ["back", "biceps"], equipment: "bodyweight", difficulty: "intermediate", description: "Underhand grip pull up. More bicep involvement.", imageKey: "chin_up" },
  { id: "lat_pulldown", name: "Lat Pulldown", muscles: ["back"], equipment: "machine", difficulty: "beginner", description: "Seated cable pulldown to upper chest.", imageKey: "lat_pulldown" },
  { id: "cable_row", name: "Cable Row", muscles: ["back"], equipment: "cable", difficulty: "beginner", description: "Seated cable row. Keep chest up, squeeze back.", imageKey: "cable_row" },
  { id: "tbar_row", name: "T-Bar Row", muscles: ["back"], equipment: "barbell", difficulty: "intermediate", description: "Chest supported or bent over T-bar row.", imageKey: "tbar_row" },
  { id: "face_pull", name: "Face Pull", muscles: ["back", "shoulders"], equipment: "cable", difficulty: "beginner", description: "Rope attachment to face height. Great for rear delts.", imageKey: "face_pull" },
  { id: "hyperextension", name: "Hyperextension", muscles: ["back"], equipment: "bodyweight", difficulty: "beginner", description: "Lower back extension on bench.", imageKey: "hyperextension" },

  // SHOULDERS
  { id: "ohp", name: "Overhead Press", muscles: ["shoulders"], equipment: "barbell", difficulty: "intermediate", description: "Standing barbell press overhead. Keep core tight.", imageKey: "overhead_press" },
  { id: "db_ohp", name: "Dumbbell Overhead Press", muscles: ["shoulders"], equipment: "dumbbell", difficulty: "beginner", description: "Seated or standing dumbbell press.", imageKey: "dumbbell_overhead_press" },
  { id: "lateral_raise", name: "Lateral Raise", muscles: ["shoulders"], equipment: "dumbbell", difficulty: "beginner", description: "Raise dumbbells to sides. Keep slight elbow bend.", imageKey: "lateral_raise" },
  { id: "front_raise", name: "Front Raise", muscles: ["shoulders"], equipment: "dumbbell", difficulty: "beginner", description: "Raise dumbbells in front to shoulder height.", imageKey: "front_raise" },
  { id: "rear_delt_fly", name: "Rear Delt Fly", muscles: ["shoulders"], equipment: "dumbbell", difficulty: "beginner", description: "Bent over or machine rear delt fly.", imageKey: "rear_delt_fly" },
  { id: "arnold_press", name: "Arnold Press", muscles: ["shoulders"], equipment: "dumbbell", difficulty: "intermediate", description: "Rotation press for all three delt heads.", imageKey: "arnold_press" },
  { id: "machine_shoulder_press", name: "Machine Shoulder Press", muscles: ["shoulders"], equipment: "machine", difficulty: "beginner", description: "Seated machine overhead press.", imageKey: "machine_shoulder_press" },
  { id: "upright_row", name: "Upright Row", muscles: ["shoulders", "biceps"], equipment: "barbell", difficulty: "intermediate", description: "Pull barbell up to chin level.", imageKey: "upright_row" },
  { id: "shrugs", name: "Barbell Shrugs", muscles: ["shoulders"], equipment: "barbell", difficulty: "beginner", description: "Shrug shoulders up. Hold at top.", imageKey: "shrugs" },
  { id: "db_shrugs", name: "Dumbbell Shrugs", muscles: ["shoulders"], equipment: "dumbbell", difficulty: "beginner", description: "Shrug with dumbbells at sides.", imageKey: "shrugs" },

  // BICEPS
  { id: "bb_curl", name: "Barbell Curl", muscles: ["biceps"], equipment: "barbell", difficulty: "beginner", description: "Standing barbell curl. Control the negative.", imageKey: "barbell_curl" },
  { id: "db_curl", name: "Dumbbell Curl", muscles: ["biceps"], equipment: "dumbbell", difficulty: "beginner", description: "Standing alternating dumbbell curl.", imageKey: "dumbbell_curl" },
  { id: "hammer_curl", name: "Hammer Curl", muscles: ["biceps"], equipment: "dumbbell", difficulty: "beginner", description: "Neutral grip curl. Targets brachialis.", imageKey: "hammer_curl" },
  { id: "preacher_curl", name: "Preacher Curl", muscles: ["biceps"], equipment: "dumbbell", difficulty: "intermediate", description: "Arm supported on preacher bench.", imageKey: "preacher_curl" },
  { id: "cable_curl", name: "Cable Curl", muscles: ["biceps"], equipment: "cable", difficulty: "beginner", description: "Straight bar or rope cable curl.", imageKey: "cable_curl" },
  { id: "concentration_curl", name: "Concentration Curl", muscles: ["biceps"], equipment: "dumbbell", difficulty: "beginner", description: "Seated curl with elbow braced against inner thigh.", imageKey: "concentration_curl" },

  // TRICEPS
  { id: "tricep_pushdown", name: "Tricep Pushdown", muscles: ["triceps"], equipment: "cable", difficulty: "beginner", description: "Cable pushdown with straight or rope bar.", imageKey: "tricep_pushdown" },
  { id: "overhead_ext", name: "Overhead Tricep Extension", muscles: ["triceps"], equipment: "dumbbell", difficulty: "beginner", description: "Single dumbbell overhead extension.", imageKey: "overhead_tricep_extension" },
  { id: "skull_crusher", name: "Skull Crusher", muscles: ["triceps"], equipment: "barbell", difficulty: "intermediate", description: "Lying tricep extension with EZ bar.", imageKey: "skull_crusher" },
  { id: "close_grip_bench", name: "Close Grip Bench", muscles: ["triceps", "chest"], equipment: "barbell", difficulty: "intermediate", description: "Narrow grip bench press for triceps.", imageKey: "close_grip_bench" },
  { id: "db_kickback", name: "Dumbbell Kickback", muscles: ["triceps"], equipment: "dumbbell", difficulty: "beginner", description: "Bent over, extend dumbbell backward.", imageKey: "dumbbell_kickback" },
  { id: "tricep_dips", name: "Tricep Dips", muscles: ["triceps", "chest"], equipment: "bodyweight", difficulty: "intermediate", description: "Upright dips on parallel bars.", imageKey: "dips" },

  // LEGS
  { id: "squat", name: "Barbell Squat", muscles: ["legs", "glutes"], equipment: "barbell", difficulty: "intermediate", description: "Back squat to parallel or below.", imageKey: "barbell_squat" },
  { id: "front_squat", name: "Front Squat", muscles: ["legs"], equipment: "barbell", difficulty: "advanced", description: "Bar in front rack position. More quad dominant.", imageKey: "front_squat" },
  { id: "leg_press", name: "Leg Press", muscles: ["legs"], equipment: "machine", difficulty: "beginner", description: "Seated or horizontal leg press.", imageKey: "leg_press" },
  { id: "leg_ext", name: "Leg Extension", muscles: ["legs"], equipment: "machine", difficulty: "beginner", description: "Isolation quad exercise on machine.", imageKey: "leg_extension" },
  { id: "leg_curl", name: "Leg Curl", muscles: ["legs"], equipment: "machine", difficulty: "beginner", description: "Lying or seated hamstring curl.", imageKey: "leg_curl" },
  { id: "calf_raise", name: "Calf Raise", muscles: ["legs"], equipment: "machine", difficulty: "beginner", description: "Standing or seated calf raise.", imageKey: "calf_raise" },
  { id: "hack_squat", name: "Hack Squat", muscles: ["legs"], equipment: "machine", difficulty: "intermediate", description: "Machine hack squat on angled sled.", imageKey: "hack_squat" },
  { id: "bulgarian_split", name: "Bulgarian Split Squat", muscles: ["legs", "glutes"], equipment: "dumbbell", difficulty: "intermediate", description: "Rear foot elevated split squat.", imageKey: "bulgarian_split_squat" },
  { id: "goblet_squat", name: "Goblet Squat", muscles: ["legs"], equipment: "dumbbell", difficulty: "beginner", description: "Squat holding dumbbell at chest. Great for form.", imageKey: "goblet_squat" },
  { id: "walking_lunge", name: "Walking Lunge", muscles: ["legs", "glutes"], equipment: "dumbbell", difficulty: "beginner", description: "Alternating walking lunges.", imageKey: "walking_lunge" },

  // GLUTES
  { id: "hip_thrust", name: "Barbell Hip Thrust", muscles: ["glutes"], equipment: "barbell", difficulty: "intermediate", description: "Shoulders on bench, thrust hips up with bar.", imageKey: "hip_thrust" },
  { id: "glute_bridge", name: "Glute Bridge", muscles: ["glutes"], equipment: "bodyweight", difficulty: "beginner", description: "Lying hip raise. Squeeze glutes at top.", imageKey: "glute_bridge" },
  { id: "cable_pull_through", name: "Cable Pull Through", muscles: ["glutes", "legs"], equipment: "cable", difficulty: "intermediate", description: "Hinge at hips pulling cable between legs.", imageKey: "cable_pull_through" },

  // CORE
  { id: "plank", name: "Plank", muscles: ["core"], equipment: "bodyweight", difficulty: "beginner", description: "Hold forearm plank for time.", imageKey: "plank" },
  { id: "crunch", name: "Cable Crunch", muscles: ["core"], equipment: "cable", difficulty: "beginner", description: "Kneeling cable crunch for abs.", imageKey: "cable_crunch" },
  { id: "hanging_leg_raise", name: "Hanging Leg Raise", muscles: ["core"], equipment: "bodyweight", difficulty: "intermediate", description: "Hang from bar, raise legs to 90°.", imageKey: "hanging_leg_raise" },
  { id: "russian_twist", name: "Russian Twist", muscles: ["core"], equipment: "bodyweight", difficulty: "beginner", description: "Seated torso rotation with weight.", imageKey: "russian_twist" },
  { id: "ab_wheel", name: "Ab Wheel Rollout", muscles: ["core"], equipment: "other", difficulty: "advanced", description: "Roll ab wheel out and back. Killer core exercise.", imageKey: "ab_wheel" },
  { id: "dead_bug", name: "Dead Bug", muscles: ["core"], equipment: "bodyweight", difficulty: "beginner", description: "Alternate arm/leg extensions lying on back.", imageKey: "dead_bug" },

  // CARDIO
  { id: "jump_rope", name: "Jump Rope", muscles: ["cardio", "legs"], equipment: "other", difficulty: "beginner", description: "30s on, 15s off intervals.", imageKey: "jump_rope" },
  { id: "burpee", name: "Burpee", muscles: ["full_body"], equipment: "bodyweight", difficulty: "intermediate", description: "Full body explosive movement.", imageKey: "burpee" },
  { id: "mountain_climber", name: "Mountain Climber", muscles: ["core", "cardio"], equipment: "bodyweight", difficulty: "beginner", description: "Alternate knee drives in plank position.", imageKey: "mountain_climber" },
  { id: "jumping_jack", name: "Jumping Jack", muscles: ["cardio"], equipment: "bodyweight", difficulty: "beginner", description: "Classic cardio warm up movement.", imageKey: "jumping_jack" },
  { id: "high_knees", name: "High Knees", muscles: ["cardio"], equipment: "bodyweight", difficulty: "beginner", description: "Run in place bringing knees to hip height.", imageKey: "high_knees" },

  // FULL BODY
  { id: "clean", name: "Power Clean", muscles: ["full_body"], equipment: "barbell", difficulty: "advanced", description: "Explosive pull from floor to front rack.", imageKey: "power_clean" },
  { id: "snatch", name: "Snatch", muscles: ["full_body"], equipment: "barbell", difficulty: "advanced", description: "One motion bar from floor to overhead.", imageKey: "snatch" },
  { id: "kettlebell_swing", name: "Kettlebell Swing", muscles: ["glutes", "full_body"], equipment: "kettlebell", difficulty: "intermediate", description: "Hip hinge swing. Explosive glute drive.", imageKey: "kettlebell_swing" },
  { id: "thruster", name: "Thruster", muscles: ["legs", "shoulders"], equipment: "barbell", difficulty: "intermediate", description: "Front squat into overhead press.", imageKey: "thruster" },
  { id: "turkish_getup", name: "Turkish Get Up", muscles: ["full_body"], equipment: "kettlebell", difficulty: "advanced", description: "Stand up from floor with weight overhead.", imageKey: "turkish_getup" },
  { id: "man_maker", name: "Man Maker", muscles: ["full_body"], equipment: "dumbbell", difficulty: "advanced", description: "Push up, row, clean, press. Full body beast.", imageKey: "man_maker" },
];

export function searchExercises(query: string): ExerciseDefinition[] {
  const q = query.toLowerCase().trim();
  if (!q) return EXERCISE_LIBRARY;
  return EXERCISE_LIBRARY.filter(
    (ex) =>
      ex.name.toLowerCase().includes(q) ||
      ex.muscles.some((m) => MUSCLE_GROUP_LABELS[m].toLowerCase().includes(q)) ||
      EQUIPMENT_LABELS[ex.equipment].toLowerCase().includes(q) ||
      ex.description.toLowerCase().includes(q)
  );
}

export function getExercisesByMuscleGroup(muscle: MuscleGroup): ExerciseDefinition[] {
  return EXERCISE_LIBRARY.filter((ex) => ex.muscles.includes(muscle));
}

export function getExerciseById(id: string): ExerciseDefinition | undefined {
  return EXERCISE_LIBRARY.find((ex) => ex.id === id);
}
