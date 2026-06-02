const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env and .env.local
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '.env.local') });

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/moodboard';

const counselorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  photo: { type: String, required: true },
  title: { type: String, required: true },
  bio: { type: String, required: true },
  specializations: [{ type: String }],
  languages: [{ type: String }],
  sessionTypes: [{ type: String, default: ['video', 'chat'] }],
  available: { type: Boolean, default: true },
  inSession: { type: Boolean, default: false },
  password: { type: String, required: true },
});

// Hash password before saving
counselorSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const Counselor = mongoose.models.Counselor || mongoose.model('Counselor', counselorSchema);

const counselorsData = [
  {
    name: "Dr. Priya Sharma",
    slug: "priya-sharma",
    photo: "/counselors/priya.png",
    title: "Clinical Psychologist, 8 years experience",
    bio: "Specializing in depression, grief counseling, and building self-esteem. Passionate about empowering individuals to navigate emotional challenges.",
    specializations: ["depression", "grief", "self-esteem"],
    languages: ["English", "Hindi"],
    password: "counselor_priya_2025"
  },
  {
    name: "Marcus Vance",
    slug: "marcus-vance",
    photo: "/counselors/marcus.png",
    title: "Cognitive Behavioral Therapist, 6 years experience",
    bio: "Focused on helping individuals overcome anxiety, stress, and trauma. I use evidence-based approaches to guide your healing journey.",
    specializations: ["anxiety", "stress", "trauma"],
    languages: ["English"],
    password: "counselor_marcus_2025"
  },
  {
    name: "Elena Rostova",
    slug: "elena-rostova",
    photo: "/counselors/elena.png",
    title: "Anger Management Specialist, 7 years experience",
    bio: "Specialist in managing anger, resolving conflict, and reducing stress. Dedicated to helping you find peace and healthier communication.",
    specializations: ["anger", "conflict", "stress"],
    languages: ["English", "Russian"],
    password: "counselor_elena_2025"
  },
  {
    name: "Dr. Aarav Patel",
    slug: "aarav-patel",
    photo: "/counselors/aarav.png",
    title: "Mindfulness and Burnout Coach, 5 years experience",
    bio: "Specializing in motivation and burnout recovery. Helping high-achievers find balance, meaning, and sustainable lifestyle changes.",
    specializations: ["burnout", "motivation"],
    languages: ["English", "Hindi", "Gujarati"],
    password: "counselor_aarav_2025"
  },
  {
    name: "Sarah Jenkins",
    slug: "sarah-jenkins",
    photo: "/counselors/sarah.png",
    title: "Life Transitions & Trauma Therapist, 10 years experience",
    bio: "Helping people handle major life-transitions, unexpected surprises, and trauma recovery. Providing a safe space to heal and grow.",
    specializations: ["life-transitions", "trauma", "stress"],
    languages: ["English", "Spanish"],
    password: "counselor_sarah_2025"
  },
  {
    name: "Kenji Takahashi",
    slug: "kenji-takahashi",
    photo: "/counselors/kenji.png",
    title: "Depression and Grief Counselor, 9 years experience",
    bio: "Deeply committed to supporting clients through feelings of sadness, depression, and self-esteem issues. Together we build a path forward.",
    specializations: ["depression", "grief", "self-esteem"],
    languages: ["English", "Japanese"],
    password: "counselor_kenji_2025"
  },
  {
    name: "Dr. Amara Okoro",
    slug: "amara-okoro",
    photo: "/counselors/amara.png",
    title: "Clinical Social Worker & Anxiety Specialist, 7 years experience",
    bio: "Passionate about working with anxiety, stress, and trauma. I use holistic techniques to build resilience and daily coping strategies.",
    specializations: ["anxiety", "stress", "trauma"],
    languages: ["English", "Igbo"],
    password: "counselor_amara_2025"
  }
];

async function seed() {
  try {
    console.log("Connecting to MongoDB at:", mongoUrl);
    await mongoose.connect(mongoUrl);
    console.log("Connected. Clearing existing counselors...");
    await Counselor.deleteMany({});
    
    console.log("Seeding new counselors...");
    for (const data of counselorsData) {
      const c = new Counselor(data);
      await c.save();
      console.log(`Created counselor: ${c.name} (${c.slug})`);
    }
    console.log("Seeding complete!");
  } catch (err) {
    console.error("Error during seeding:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

seed();
