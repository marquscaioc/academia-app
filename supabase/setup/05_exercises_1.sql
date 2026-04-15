-- =============================================================================
-- ACADEMIA APP - PARTE 5/12: Exercícios 1-220 de 873
-- =============================================================================
-- Cole no SQL Editor do Supabase e clique em RUN.
-- Idempotente (use IF NOT EXISTS / ON CONFLICT).
-- =============================================================================

-- =============================================
-- EXERCISE DATABASE: 873 exercises
-- Source: github.com/yuhonas/free-exercise-db
-- =============================================

-- First, clear existing exercises (keep muscle_groups and equipment)
DELETE FROM public.workout_exercises WHERE TRUE;
DELETE FROM public.exercises WHERE TRUE;

-- Insert exercises (mapped to existing muscle_groups and equipment)
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  '3/4 Sit-Up',
  'abdominals - strength',
  '1. Lie down on the floor and secure your feet. Your legs should be bent at the knees.
2. Place your hands behind or to the side of your head. You will begin with your back on the ground. This will be your starting position.
3. Flex your hips and spine to raise your torso toward your knees.
4. At the top of the contraction your torso should be perpendicular to the ground. Reverse the motion, going only ¾ of the way down.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  '90/90 Hamstring',
  'hamstrings - stretching',
  '1. Lie on your back, with one leg extended straight out.
2. With the other leg, bend the hip and knee to 90 degrees. You may brace your leg with your hands if necessary. This will be your starting position.
3. Extend your leg straight into the air, pausing briefly at the top. Return the leg to the starting position.
4. Repeat for 10-20 repetitions, and then switch to the other leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Ab Crunch Machine',
  'abdominals - strength',
  '1. Select a light resistance and sit down on the ab machine placing your feet under the pads provided and grabbing the top handles. Your arms should be bent at a 90 degree angle as you rest the triceps on the pads provided. This will be your starting position.
2. At the same time, begin to lift the legs up as you crunch your upper torso. Breathe out as you perform this movement. Tip: Be sure to use a slow and controlled motion. Concentrate on using your abs to move the weight while relaxing your legs and feet.
3. After a second pause, slowly return to the starting position as you breathe in.
4. Repeat the movement for the prescribed amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Ab Roller',
  'abdominals - strength',
  '1. Hold the Ab Roller with both hands and kneel on the floor.
2. Now place the ab roller on the floor in front of you so that you are on all your hands and knees (as in a kneeling push up position). This will be your starting position.
3. Slowly roll the ab roller straight forward, stretching your body into a straight position. Tip: Go down as far as you can without touching the floor with your body. Breathe in during this portion of the movement.
4. After a pause at the stretched position, start pulling yourself back to the starting position as you breathe out. Tip: Go slowly and keep your abs tight at all times.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Adductor',
  'adductors - stretching',
  '1. Lie face down with one leg on a foam roll.
2. Rotate the leg so that the foam roll contacts against your inner thigh. Shift as much weight onto the foam roll as can be tolerated.
3. While trying to relax the muscles if the inner thigh, roll over the foam between your hip and knee, holding points of tension for 10-30 seconds. Repeat with the other leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Rolo de Espuma' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Adductor/Groin',
  'adductors - stretching',
  '1. Lie on your back with your feet raised towards the ceiling.
2. Have your partner hold your feet or ankles. Abduct your legs as far as you can. This will be your starting position.
3. Attempt to squeeze your legs together for 10 or more seconds, while your partner prevents you from doing so.
4. Now, relax the muscles in your legs as your partner pushes your feet apart, stretching as far as is comfortable for you. Be sure to let your partner know when the stretch is adequate to prevent overstretching or injury.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Advanced Kettlebell Windmill',
  'abdominals - strength',
  '1. Clean and press a kettlebell overhead with one arm.
2. Keeping the kettlebell locked out at all times, push your butt out in the direction of the locked out kettlebell. Keep the non-working arm behind your back and turn your feet out at a forty-five degree angle from the arm with the kettlebell.
3. Lower yourself as far as possible.
4. Pause for a second and reverse the motion back to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Air Bike',
  'abdominals - strength',
  '1. Lie flat on the floor with your lower back pressed to the ground. For this exercise, you will need to put your hands beside your head. Be careful however to not strain with the neck as you perform it. Now lift your shoulders into the crunch position.
2. Bring knees up to where they are perpendicular to the floor, with your lower legs parallel to the floor. This will be your starting position.
3. Now simultaneously, slowly go through a cycle pedal motion kicking forward with the right leg and bringing in the knee of the left leg. Bring your right elbow close to your left knee by crunching to the side, as you breathe out.
4. Go back to the initial position as you breathe in.
5. Crunch to the opposite side as you cycle your legs and bring closer your left elbow to your right knee and exhale.
6. Continue alternating in this manner until all of the recommended repetitions for each side have been completed.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'All Fours Quad Stretch',
  'quadriceps - stretching',
  '1. Start off on your hands and knees, then lift your leg off the floor and hold the foot with your hand.
2. Use your hand to hold the foot or ankle, keeping the knee fully flexed, stretching the quadriceps and hip flexors.
3. Focus on extending your hips, thrusting them towards the floor. Hold for 10-20 seconds and then switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Alternate Hammer Curl',
  'biceps - strength',
  '1. Stand up with your torso upright and a dumbbell in each hand being held at arms length. The elbows should be close to the torso.
2. The palms of the hands should be facing your torso. This will be your starting position.
3. While holding the upper arm stationary, curl the right weight forward while contracting the biceps as you breathe out. Continue the movement until your biceps is fully contracted and the dumbbells are at shoulder level. Hold the contracted position for a second as you squeeze the biceps. Tip: Only the forearms should move.
4. Slowly begin to bring the dumbbells back to starting position as your breathe in.
5. Repeat the movement with the left hand. This equals one repetition.
6. Continue alternating in this manner for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Alternate Heel Touchers',
  'abdominals - strength',
  '1. Lie on the floor with the knees bent and the feet on the floor around 18-24 inches apart. Your arms should be extended by your side. This will be your starting position.
2. Crunch over your torso forward and up about 3-4 inches to the right side and touch your right heel as you hold the contraction for a second. Exhale while performing this movement.
3. Now go back slowly to the starting position as you inhale.
4. Now crunch over your torso forward and up around 3-4 inches to the left side and touch your left heel as you hold the contraction for a second. Exhale while performing this movement and then go back to the starting position as you inhale. Now that both heels have been touched, that is considered 1 repetition.
5. Continue alternating sides in this manner until all prescribed repetitions are done.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Alternate Incline Dumbbell Curl',
  'biceps - strength',
  '1. Sit down on an incline bench with a dumbbell in each hand being held at arms length. Tip: Keep the elbows close to the torso.This will be your starting position.
2. While holding the upper arm stationary, curl the right weight forward while contracting the biceps as you breathe out. As you do so, rotate the hand so that the palm is facing up. Continue the movement until your biceps is fully contracted and the dumbbells are at shoulder level. Hold the contracted position for a second as you squeeze the biceps. Tip: Only the forearms should move.
3. Slowly begin to bring the dumbbell back to starting position as your breathe in.
4. Repeat the movement with the left hand. This equals one repetition.
5. Continue alternating in this manner for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Alternate Leg Diagonal Bound',
  'quadriceps - plyometrics',
  '1. Assume a comfortable stance with one foot slightly in front of the other.
2. Begin by pushing off with the front leg, driving the opposite knee forward and as high as possible before landing. Attempt to cover as much distance to each side with each bound.
3. It may help to use a line on the ground to guage distance from side to side.
4. Repeat the sequence with the other leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Alternating Cable Shoulder Press',
  'shoulders - strength',
  '1. Move the cables to the bottom of the tower and select an appropriate weight.
2. Grasp the cables and hold them at shoulder height, palms facing forward. This will be your starting position.
3. Keeping your head and chest up, extend through the elbow to press one side directly over head.
4. After pausing at the top, return to the starting position and repeat on the opposite side.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Alternating Deltoid Raise',
  'shoulders - strength',
  '1. In a standing position, hold a pair of dumbbells at your side.
2. Keeping your elbows slightly bent, raise the weights directly in front of you to shoulder height, avoiding any swinging or cheating.
3. Return the weights to your side.
4. On the next repetition, raise the weights laterally, raising them out to your side to about shoulder height.
5. Return the weights to the starting position and continue alternating to the front and side.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Alternating Floor Press',
  'chest - strength',
  '1. Lie on the floor with two kettlebells next to your shoulders.
2. Position one in place on your chest and then the other, gripping the kettlebells on the handle with the palms facing forward.
3. Extend both arms, so that the kettlebells are being held above your chest. Lower one kettlebell, bringing it to your chest and turn the wrist in the direction of the locked out kettlebell.
4. Raise the kettlebell and repeat on the opposite side.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Alternating Hang Clean',
  'hamstrings - strength',
  '1. Place two kettlebells between your feet. To get in the starting position, push your butt back and look straight ahead.
2. Clean one kettlebell to your shoulder and hold on to the other kettlebell in a hanging position. Clean the kettlebell to your shoulder by extending through the legs and hips as you pull the kettlebell towards your shoulders. Rotate your wrist as you do so.
3. Lower the cleaned kettlebell to a hanging position and clean the alternate kettlebell. Repeat.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Alternating Kettlebell Press',
  'shoulders - strength',
  '1. Clean two kettlebells to your shoulders. Clean the kettlebells to your shoulders by extending through the legs and hips as you pull the kettlebells towards your shoulders. Rotate your wrists as you do so.
2. Press one directly overhead by extending through the elbow, turning it so the palm faces forward while holding the other kettlebell stationary .
3. Lower the pressed kettlebell to the starting position and immediately press with your other arm.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Alternating Kettlebell Row',
  'middle back - strength',
  '1. Place two kettlebells in front of your feet. Bend your knees slightly and push your butt out as much as possible. As you bend over to get into the starting position grab both kettlebells by the handles.
2. Pull one kettlebell off of the floor while holding on to the other kettlebell. Retract the shoulder blade of the working side, as you flex the elbow, drawing the kettlebell towards your stomach or rib cage.
3. Lower the kettlebell in the working arm and repeat with your other arm.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Alternating Renegade Row',
  'middle back - strength',
  '1. Place two kettlebells on the floor about shoulder width apart. Position yourself on your toes and your hands as though you were doing a pushup, with the body straight and extended. Use the handles of the kettlebells to support your upper body. You may need to position your feet wide for support.
2. Push one kettlebell into the floor and row the other kettlebell, retracting the shoulder blade of the working side as you flex the elbow, pulling it to your side.
3. Then lower the kettlebell to the floor and begin the kettlebell in the opposite hand. Repeat for several reps.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Ankle Circles',
  'calves - stretching',
  '1. Use a sturdy object like a squat rack to hold yourself.
2. Lift the right leg in the air (just around 2 inches from the floor) and perform a circular motion with the big toe. Pretend that you are drawing a big circle with it. Tip: One circle equals 1 repetition. Breathe normally as you perform the movement.
3. When you are done with the right foot, then repeat with the left leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Panturrilha' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Ankle On The Knee',
  'glutes - stretching',
  '1. From a lying position, bend your knees and keep your feet on the floor.
2. Place your ankle of one foot on your opposite knee.
3. Grasp the thigh or knee of the bottom leg and pull both of your legs into the chest. Relax your neck and shoulders. Hold for 10-20 seconds and then switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Anterior Tibialis-SMR',
  'calves - stretching',
  '1. Begin seated on the ground with your legs bent and your feet on the floor.
2. Using a Muscle Roller or a rolling pin, apply pressure to the muscles on the outside of your shins. Work from just below the knee to above the ankle, pausing at points of tension for 10-30 seconds. Repeat on the other leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Panturrilha' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Anti-Gravity Press',
  'shoulders - strength',
  '1. Place a bar on the ground behind the head of an incline bench.
2. Lay on the bench face down. With a pronated grip, pick the barbell up from the floor. Flex the elbows, performing a reverse curl to bring the bar near your chest. This will be your starting position.
3. To begin, press the barbell out in front of your head by extending your elbows. Keep your arms parallel to the ground throughout the movement.
4. Return to the starting position and repeat to complete the set.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Arm Circles',
  'shoulders - stretching',
  '1. Stand up and extend your arms straight out by the sides. The arms should be parallel to the floor and perpendicular (90-degree angle) to your torso. This will be your starting position.
2. Slowly start to make circles of about 1 foot in diameter with each outstretched arm. Breathe normally as you perform the movement.
3. Continue the circular motion of the outstretched arms for about ten seconds. Then reverse the movement, going the opposite direction.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Arnold Dumbbell Press',
  'shoulders - strength',
  '1. Sit on an exercise bench with back support and hold two dumbbells in front of you at about upper chest level with your palms facing your body and your elbows bent. Tip: Your arms should be next to your torso. The starting position should look like the contracted portion of a dumbbell curl.
2. Now to perform the movement, raise the dumbbells as you rotate the palms of your hands until they are facing forward.
3. Continue lifting the dumbbells until your arms are extended above you in straight arm position. Breathe out as you perform this portion of the movement.
4. After a second pause at the top, begin to lower the dumbbells to the original position by rotating the palms of your hands towards you. Tip: The left arm will be rotated in a counter clockwise manner while the right one will be rotated clockwise. Breathe in as you perform this portion of the movement.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Around The Worlds',
  'chest - strength',
  '1. Lay down on a flat bench holding a dumbbell in each hand with the palms of the hands facing towards the ceiling. Tip: Your arms should be parallel to the floor and next to your thighs. To avoid injury, make sure that you keep your elbows slightly bent. This will be your starting position.
2. Now move the dumbbells by creating a semi-circle as you displace them from the initial position to over the head. All of the movement should happen with the arms parallel to the floor at all times. Breathe in as you perform this portion of the movement.
3. Reverse the movement to return the weight to the starting position as you exhale.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Atlas Stone Trainer',
  'lower back - strongman',
  '1. This trainer is effective for developing Atlas Stone strength for those who don''t have access to stones, and are typically made from bar ends or heavy pipe.
2. Begin by loading the desired weight onto the bar. Straddle the weight, wrapping your arms around the implement, bending at the hips.
3. Begin by pulling the weight up past the knees, extending through the hips. As the weight clears the knees, it can be lapped by resting it on your thighs and sitting back, hugging it tightly to your chest.
4. Finish the movement by extending through your hips and knees to raise the weight as high as possible. The weight can be returned to the lap or to the ground for successive repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Atlas Stones',
  'lower back - strongman',
  '1. Begin with the atlas stone between your feet. Bend at the hips to wrap your arms vertically around the Atlas Stone, attempting to get your fingers underneath the stone. Many stones will have a small flat portion on the bottom, which will make the stone easier to hold.
2. Pulling the stone into your torso, drive through the back half of your feet to pull the stone from the ground.
3. As the stone passes the knees, lap it by sitting backward, pulling the stone on top of your thighs.
4. Sit low, getting the stone high onto your chest as you change your grip to reach over the stone. Stand, driving through with your hips. Close distance to the loading platform, and lean back, extending the hips to get the stone as high as possible.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Axle Deadlift',
  'lower back - strongman',
  '1. Approach the bar so that it is centered over your feet. You feet should be about hip width apart. Bend at the hip to grip the bar at shoulder width, allowing your shoulder blades to protract. Typically, you would use an over/under grip.
2. With your feet and your grip set, take a big breath and then lower your hips and flex the knees until your shins contact the bar. Look forward with your head, keep your chest up and your back arched, and begin driving through the heels to move the weight upward.
3. After the bar passes the knees, aggressively pull the bar back, pulling your shoulder blades together as you drive your hips forward into the bar.
4. Lower the bar by bending at the hips and guiding it to the floor.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Back Flyes - With Bands',
  'shoulders - strength',
  '1. Run a band around a stationary post like that of a squat rack.
2. Grab the band by the handles and stand back so that the tension in the band rises.
3. Extend and lift the arms straight in front of you. Tip: Your arms should be straight and parallel to the floor while perpendicular to your torso. Your feet should be firmly planted on the floor spread at shoulder width. This will be your starting position.
4. As you exhale, move your arms to the sides and back. Keep your arms extended and parallel to the floor. Continue the movement until the arms are extended to your sides.
5. After a pause, go back to the original position as you inhale.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Elástico/Banda' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Backward Drag',
  'quadriceps - strongman',
  '1. Load a sled with the desired weight, attaching a rope or straps to the sled that you can hold onto.
2. Begin the exercise by moving backwards for a given distance. Leaning back, extend through the legs for short steps to move as quickly as possible.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Backward Medicine Ball Throw',
  'shoulders - plyometrics',
  '1. This exercise is best done with a partner. If you lack a partner, the ball can be thrown and retrieved or thrown against a wall.
2. Begin standing a few meters in front of your partner, both facing the same direction. Begin holding the ball between your legs.
3. Squat down and then forcefully reverse direction, coming to full extension and you toss the ball over your head to your partner.
4. Your partner can then roll the ball back to you. Repeat for the desired number of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Balance Board',
  'calves - strength',
  '1. Place a balance board in front of you.
2. Stand up on it and try to balance yourself.
3. Hold the balance for as long as desired.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Panturrilha' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Ball Leg Curl',
  'hamstrings - strength',
  '1. Begin on the floor laying on your back with your feet on top of the ball.
2. Position the ball so that when your legs are extended your ankles are on top of the ball. This will be your starting position.
3. Raise your hips off of the ground, keeping your weight on the shoulder blades and your feet.
4. Flex the knees, pulling the ball as close to you as you can, contracting the hamstrings.
5. After a brief pause, return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Band Assisted Pull-Up',
  'lats - strength',
  '1. Choke the band around the center of the pullup bar. You can use different bands to provide varying levels of assistance.
2. Pull the end of the band down, and place one bent knee into the loop, ensuring it won''t slip out. Take a medium to wide grip on the bar. This will be your starting position.
3. Pull yourself upward by contracting the lats as you flex the elbow. The elbow should be driven to your side. Pull to the front, attempting to get your chin over the bar. Avoid swinging or jerking movements.
4. After a brief pause, return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Band Good Morning',
  'hamstrings - powerlifting',
  '1. Using a 41 inch band, stand on one end, spreading your feet a small amount. Bend at the hips to loop the end of the band behind your neck. This will be your starting position.
2. Keeping your legs straight, extend through the hips to come to a near vertical position.
3. Ensure that you do not round your back as you go down back to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Elástico/Banda' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Band Good Morning (Pull Through)',
  'hamstrings - powerlifting',
  '1. Loop the band around a post. Standing a little ways away, loop the opposite end around the neck. Your hands can help hold the band in position.
2. Begin by bending at the hips, getting your butt back as far as possible. Keep your back flat and bend forward to about 90 degrees. Your knees should be only slightly bent.
3. Return to the starting position be driving through with the hips to come back to a standing position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Elástico/Banda' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Band Hip Adductions',
  'adductors - strength',
  '1. Anchor a band around a solid post or other object.
2. Stand with your left side to the post, and put your right foot through the band, getting it around the ankle.
3. Stand up straight and hold onto the post if needed. This will be your starting position.
4. Keeping the knee straight, raise your right legs out to the side as far as you can.
5. Return to the starting position and repeat for the desired rep count.
6. Switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Elástico/Banda' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Band Pull Apart',
  'shoulders - strength',
  '1. Begin with your arms extended straight out in front of you, holding the band with both hands.
2. Initiate the movement by performing a reverse fly motion, moving your hands out laterally to your sides.
3. Keep your elbows extended as you perform the movement, bringing the band to your chest. Ensure that you keep your shoulders back during the exercise.
4. Pause as you complete the movement, returning to the starting position under control.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Elástico/Banda' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Band Skull Crusher',
  'triceps - strength',
  '1. Secure a band to the base of a rack or the bench. Lay on the bench so that the band is lined up with your head.
2. Take hold of the band, raising your elbows so that the upper arm is perpendicular to the floor. With the elbow flexed, the band should be above your head. This will be your starting position.
3. Extend through the elbow to straighten your arm, keeping your upper arm in place. Pause at the top of the motion, and return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Elástico/Banda' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Barbell Ab Rollout',
  'abdominals - strength',
  '1. For this exercise you will need to get into a pushup position, but instead of having your hands of the floor, you will be grabbing on to an Olympic barbell (loaded with 5-10 lbs on each side) instead. This will be your starting position.
2. While keeping a slight arch on your back, lift your hips and roll the barbell towards your feet as you exhale. Tip: As you perform the movement, your glutes should be coming up, you should be keeping the abs tight and should maintain your back posture at all times. Also your arms should be staying perpendicular to the floor throughout the movement. If you don''t, you will work out your shoulders and back more than the abs.
3. After a second contraction at the top, start to roll the barbell back forward to the starting position slowly as you inhale.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Barbell Ab Rollout - On Knees',
  'abdominals - strength',
  '1. Hold an Olympic barbell loaded with 5-10lbs on each side and kneel on the floor.
2. Now place the barbell on the floor in front of you so that you are on all your hands and knees (as in a kneeling push up position). This will be your starting position.
3. Slowly roll the barbell straight forward, stretching your body into a straight position. Tip: Go down as far as you can without touching the floor with your body. Breathe in during this portion of the movement.
4. After a second pause at the stretched position, start pulling yourself back to the starting position as you breathe out. Tip: Go slowly and keep your abs tight at all times.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Barbell Bench Press - Medium Grip',
  'chest - strength',
  '1. Lie back on a flat bench. Using a medium width grip (a grip that creates a 90-degree angle in the middle of the movement between the forearms and the upper arms), lift the bar from the rack and hold it straight over you with your arms locked. This will be your starting position.
2. From the starting position, breathe in and begin coming down slowly until the bar touches your middle chest.
3. After a brief pause, push the bar back to the starting position as you breathe out. Focus on pushing the bar using your chest muscles. Lock your arms and squeeze your chest in the contracted position at the top of the motion, hold for a second and then start coming down slowly again. Tip: Ideally, lowering the weight should take about twice as long as raising it.
4. Repeat the movement for the prescribed amount of repetitions.
5. When you are done, place the bar back in the rack.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Rosca Direta com Barra',
  'biceps - strength',
  '1. Stand up with your torso upright while holding a barbell at a shoulder-width grip. The palm of your hands should be facing forward and the elbows should be close to the torso. This will be your starting position.
2. While holding the upper arms stationary, curl the weights forward while contracting the biceps as you breathe out. Tip: Only the forearms should move.
3. Continue the movement until your biceps are fully contracted and the bar is at shoulder level. Hold the contracted position for a second and squeeze the biceps hard.
4. Slowly begin to bring the bar back to starting position as your breathe in.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Barbell Curls Lying Against An Incline',
  'biceps - strength',
  '1. Lie against an incline bench, with your arms holding a barbell and hanging down in a horizontal line. This will be your starting position.
2. While keeping the upper arms stationary, curl the weight up as high as you can while squeezing the biceps. Breathe out as you perform this portion of the movement. Tip: Only the forearms should move. Do not swing the arms.
3. After a second contraction, slowly go back to the starting position as you inhale. Tip: Make sure that you go all of the way down.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Barbell Deadlift',
  'lower back - strength',
  '1. Stand in front of a loaded barbell.
2. While keeping the back as straight as possible, bend your knees, bend forward and grasp the bar using a medium (shoulder width) overhand grip. This will be the starting position of the exercise. Tip: If it is difficult to hold on to the bar with this grip, alternate your grip or use wrist straps.
3. While holding the bar, start the lift by pushing with your legs while simultaneously getting your torso to the upright position as you breathe out. In the upright position, stick your chest out and contract the back by bringing the shoulder blades back. Think of how the soldiers in the military look when they are in standing in attention.
4. Go back to the starting position by bending at the knees while simultaneously leaning the torso forward at the waist while keeping the back straight. When the weights on the bar touch the floor you are back at the starting position and ready to perform another repetition.
5. Perform the amount of repetitions prescribed in the program.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Barbell Full Squat',
  'quadriceps - strength',
  '1. This exercise is best performed inside a squat rack for safety purposes. To begin, first set the bar on a rack just above shoulder level. Once the correct height is chosen and the bar is loaded, step under the bar and place the back of your shoulders (slightly below the neck) across it.
2. Hold on to the bar using both arms at each side and lift it off the rack by first pushing with your legs and at the same time straightening your torso.
3. Step away from the rack and position your legs using a shoulder-width medium stance with the toes slightly pointed out. Keep your head up at all times and maintain a straight back. This will be your starting position.
4. Begin to slowly lower the bar by bending the knees and sitting back with your hips as you maintain a straight posture with the head up. Continue down until your hamstrings are on your calves. Inhale as you perform this portion of the movement.
5. Begin to raise the bar as you exhale by pushing the floor with the heel or middle of your foot as you straighten the legs and extend the hips to go back to the starting position.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Barbell Glute Bridge',
  'glutes - powerlifting',
  '1. Begin seated on the ground with a loaded barbell over your legs. Using a fat bar or having a pad on the bar can greatly reduce the discomfort caused by this exercise. Roll the bar so that it is directly above your hips, and lay down flat on the floor.
2. Begin the movement by driving through with your heels, extending your hips vertically through the bar. Your weight should be supported by your upper back and the heels of your feet.
3. Extend as far as possible, then reverse the motion to return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Barbell Guillotine Bench Press',
  'chest - strength',
  '1. Using a medium width grip (a grip that creates a 90-degree angle in the middle of the movement between the forearms and the upper arms), lift the bar from the rack and hold it straight over your neck with your arms locked. This will be your starting position.
2. As you breathe in, bring the bar down slowly until it is about 1 inch from your neck.
3. After a second pause, bring the bar back to the starting position as you breathe out and push the bar using your chest muscles. Lock your arms and squeeze your chest in the contracted position, hold for a second and then start coming down slowly again. It should take at least twice as long to go down than to come up.
4. Repeat the movement for the prescribed amount of repetitions.
5. When you are done, place the bar back in the rack.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Barbell Hack Squat',
  'quadriceps - strength',
  '1. Stand up straight while holding a barbell behind you at arms length and your feet at shoulder width. Tip: A shoulder width grip is best with the palms of your hands facing back. You can use wrist wraps for this exercise for a better grip. This will be your starting position.
2. While keeping your head and eyes up and back straight, squat until your upper thighs are parallel to the floor. Breathe in as you slowly go down.
3. Pressing mainly with the heel of the foot and squeezing the thighs, go back up as you breathe out.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Barbell Hip Thrust',
  'glutes - powerlifting',
  '1. Begin seated on the ground with a bench directly behind you. Have a loaded barbell over your legs. Using a fat bar or having a pad on the bar can greatly reduce the discomfort caused by this exercise.
2. Roll the bar so that it is directly above your hips, and lean back against the bench so that your shoulder blades are near the top of it.
3. Begin the movement by driving through your feet, extending your hips vertically through the bar. Your weight should be supported by your shoulder blades and your feet. Extend as far as possible, then reverse the motion to return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Barbell Incline Bench Press - Medium Grip',
  'chest - strength',
  '1. Lie back on an incline bench. Using a medium-width grip (a grip that creates a 90-degree angle in the middle of the movement between the forearms and the upper arms), lift the bar from the rack and hold it straight over you with your arms locked. This will be your starting position.
2. As you breathe in, come down slowly until you feel the bar on you upper chest.
3. After a second pause, bring the bar back to the starting position as you breathe out and push the bar using your chest muscles. Lock your arms in the contracted position, squeeze your chest, hold for a second and then start coming down slowly again. Tip: it should take at least twice as long to go down than to come up.
4. Repeat the movement for the prescribed amount of repetitions.
5. When you are done, place the bar back in the rack.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Barbell Incline Shoulder Raise',
  'shoulders - strength',
  '1. Lie back on an Incline Bench. Using a medium width grip (a grip that is slightly wider than shoulder width), lift the bar from the rack and hold it straight over you with your arms straight. This will be your starting position.
2. While keeping the arms straight, lift the bar by protracting your shoulder blades, raising the shoulders from the bench as you breathe out.
3. Bring back the bar to the starting position as you breathe in.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Barbell Lunge',
  'quadriceps - strength',
  '1. This exercise is best performed inside a squat rack for safety purposes. To begin, first set the bar on a rack just below shoulder level. Once the correct height is chosen and the bar is loaded, step under the bar and place the back of your shoulders (slightly below the neck) across it.
2. Hold on to the bar using both arms at each side and lift it off the rack by first pushing with your legs and at the same time straightening your torso.
3. Step away from the rack and step forward with your right leg and squat down through your hips, while keeping the torso upright and maintaining balance. Inhale as you go down. Note: Do not allow your knee to go forward beyond your toes as you come down, as this will put undue stress on the knee joint. li>
4. Using mainly the heel of your foot, push up and go back to the starting position as you exhale.
5. Repeat the movement for the recommended amount of repetitions and then perform with the left leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Barbell Rear Delt Row',
  'shoulders - strength',
  '1. Stand up straight while holding a barbell using a wide (higher than shoulder width) and overhand (palms facing your body) grip.
2. Bend knees slightly and bend over as you keep the natural arch of your back. Let the arms hang in front of you as they hold the bar. Once your torso is parallel to the floor, flare the elbows out and away from your body. Tip: Your torso and your arms should resemble the letter "T". Now you are ready to begin the exercise.
3. While keeping the upper arms perpendicular to the torso, pull the barbell up towards your upper chest as you squeeze the rear delts and you breathe out. Tip: When performed correctly, this exercise should resemble a bench press in reverse. Also, refrain from using your biceps to do the work. Focus on targeting the rear delts; the arms should only act as hooks.
4. Slowly go back to the initial position as you breathe in.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Barbell Rollout from Bench',
  'abdominals - strength',
  '1. Place a loaded barbell on the ground, near the end of a bench. Kneel with both legs on the bench, and take a medium to narrow grip on the barbell. This will be your starting position.
2. To begin, extend through the hips to slowly roll the bar forward. As you roll out, flex the shoulder to roll the bar above your head. Ensure that your arms remain extended throughout the movement.
3. When the bar has been moved as far forward as possible, return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Barbell Seated Calf Raise',
  'calves - strength',
  '1. Place a block about 12 inches in front of a flat bench.
2. Sit on the bench and place the ball of your feet on the block.
3. Have someone place a barbell over your upper thighs about 3 inches above your knees and hold it there. This will be your starting position.
4. Raise up on your toes as high as possible as you squeeze the calves and as you breathe out.
5. After a second contraction, slowly go back to the starting position. Tip: To get maximum benefit stretch your calves as far as you can.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Panturrilha' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Barbell Shoulder Press',
  'shoulders - strength',
  '1. Sit on a bench with back support in a squat rack. Position a barbell at a height that is just above your head. Grab the barbell with a pronated grip (palms facing forward).
2. Once you pick up the barbell with the correct grip width, lift the bar up over your head by locking your arms. Hold at about shoulder level and slightly in front of your head. This is your starting position.
3. Lower the bar down to the shoulders slowly as you inhale.
4. Lift the bar back up to the starting position as you exhale.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Barbell Shrug',
  'traps - strength',
  '1. Stand up straight with your feet at shoulder width as you hold a barbell with both hands in front of you using a pronated grip (palms facing the thighs). Tip: Your hands should be a little wider than shoulder width apart. You can use wrist wraps for this exercise for a better grip. This will be your starting position.
2. Raise your shoulders up as far as you can go as you breathe out and hold the contraction for a second. Tip: Refrain from trying to lift the barbell by using your biceps.
3. Slowly return to the starting position as you breathe in.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Trapézio' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Barbell Shrug Behind The Back',
  'traps - strength',
  '1. Stand up straight with your feet at shoulder width as you hold a barbell with both hands behind your back using a pronated grip (palms facing back). Tip: Your hands should be a little wider than shoulder width apart. You can use wrist wraps for this exercise for better grip. This will be your starting position.
2. Raise your shoulders up as far as you can go as you breathe out and hold the contraction for a second. Tip: Refrain from trying to lift the barbell by using your biceps. The arms should remain stretched out at all times.
3. Slowly return to the starting position as you breathe in.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Trapézio' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Barbell Side Bend',
  'abdominals - strength',
  '1. Stand up straight while holding a barbell placed on the back of your shoulders (slightly below the neck). Your feet should be shoulder width apart. This will be your starting position.
2. While keeping your back straight and your head up, bend only at the waist to the right as far as possible. Breathe in as you bend to the side. Then hold for a second and come back up to the starting position as you exhale. Tip: Keep the rest of the body stationary.
3. Now repeat the movement but bending to the left instead. Hold for a second and come back to the starting position.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Barbell Side Split Squat',
  'quadriceps - strength',
  '1. Stand up straight while holding a barbell placed on the back of your shoulders (slightly below the neck). Your feet should be placed wide apart with the foot of the lead leg angled out to the side. This will be your starting position.
2. Lower your body towards the side of your angled foot by bending the knee and hip of your lead leg and while keeping the opposite leg only slightly bent. Breathe in as you lower your body.
3. Return to the starting position by extending the hip and knee of the lead leg. Breathe out as you perform this movement.
4. After performing the recommended amount of reps, repeat the movement with the opposite leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Agachamento com Barra',
  'quadriceps - strength',
  '1. This exercise is best performed inside a squat rack for safety purposes. To begin, first set the bar on a rack to just below shoulder level. Once the correct height is chosen and the bar is loaded, step under the bar and place the back of your shoulders (slightly below the neck) across it.
2. Hold on to the bar using both arms at each side and lift it off the rack by first pushing with your legs and at the same time straightening your torso.
3. Step away from the rack and position your legs using a shoulder width medium stance with the toes slightly pointed out. Keep your head up at all times and also maintain a straight back. This will be your starting position. (Note: For the purposes of this discussion we will use the medium stance described above which targets overall development; however you can choose any of the three stances discussed in the foot stances section).
4. Begin to slowly lower the bar by bending the knees and hips as you maintain a straight posture with the head up. Continue down until the angle between the upper leg and the calves becomes slightly less than 90-degrees. Inhale as you perform this portion of the movement. Tip: If you performed the exercise correctly, the front of the knees should make an imaginary straight line with the toes that is perpendicular to the front. If your knees are past that imaginary line (if they are past your toes) then you are placing undue stress on the knee and the exercise has been performed incorrectly.
5. Begin to raise the bar as you exhale by pushing the floor with the heel of your foot as you straighten the legs again and go back to the starting position.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Barbell Squat To A Bench',
  'quadriceps - strength',
  '1. This exercise is best performed inside a squat rack for safety purposes. To begin, first place a flat bench or a box behind you. The flat bench is used to teach you to set your hips back and to hit depth.
2. 
3. Then, set the bar on a rack that best matches your height. Once the correct height is chosen and the bar is loaded, step under the bar and place the back of your shoulders (slightly below the neck) across it.
4. Hold on to the bar using both arms at each side and lift it off the rack by first pushing with your legs and at the same time straightening your torso.
5. Step away from the rack and position your legs using a shoulder width medium stance with the toes slightly pointed out. Keep your head up at all times as looking down will get you off balance and also maintain a straight back. This will be your starting position. (Note: For the purposes of this discussion we will use the medium stance described above which targets overall development; however you can choose any of the three stances discussed in the foot stances section).
6. Begin to slowly lower the bar by bending the knees and sitting your hips back as you maintain a straight posture with the head up. Continue down until you slightly touch the bench behind you. Inhale as you perform this portion of the movement. Tip: If you performed the exercise correctly, the front of the knees should make an imaginary straight line with the toes that is perpendicular to the front. If your knees are past that imaginary line (if they are past your toes) then you are placing undue stress on the knee and the exercise has been performed incorrectly.
7. Begin to raise the bar as you exhale by pushing the floor with the heel of your foot as you straighten the legs and extend the hips to go back to the starting position.
8. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Barbell Step Ups',
  'quadriceps - strength',
  '1. Stand up straight while holding a barbell placed on the back of your shoulders (slightly below the neck) and stand upright behind an elevated platform (such as the one used for spotting behind a flat bench). This is your starting position.
2. Place the right foot on the elevated platform. Step on the platform by extending the hip and the knee of your right leg. Use the heel mainly to lift the rest of your body up and place the foot of the left leg on the platform as well. Breathe out as you execute the force required to come up.
3. Step down with the left leg by flexing the hip and knee of the right leg as you inhale. Return to the original standing position by placing the right foot of to next to the left foot on the initial position.
4. Repeat with the right leg for the recommended amount of repetitions and then perform with the left leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Barbell Walking Lunge',
  'quadriceps - strength',
  '1. Begin standing with your feet shoulder width apart and a barbell across your upper back.
2. Step forward with one leg, flexing the knees to drop your hips. Descend until your rear knee nearly touches the ground. Your posture should remain upright, and your front knee should stay above the front foot.
3. Drive through the heel of your lead foot and extend both knees to raise yourself back up.
4. Step forward with your rear foot, repeating the lunge on the opposite leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Battling Ropes',
  'shoulders - strength',
  '1. For this exercise you will need a heavy rope anchored at its center 15-20 feet away. Standing in front of the rope, take an end in each hand with your arms extended at your side. This will be your starting position.
2. Initiate the movement by rapidly raising one arm to shoulder level as quickly as you can.
3. As you let that arm drop to the starting position, raise the opposite side.
4. Continue alternating your left and right arms, whipping the ropes up and down as fast as you can.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bear Crawl Sled Drags',
  'quadriceps - strongman',
  '1. Wearing either a harness or a loose weight belt, attach the chain to the back so that you will be facing away from the sled. Bend down so that your hands are on the ground. Your back should be flat and knees bent. This is your starting position.
2. Begin by driving with legs, alternating left and right. Use your hands to maintain balance and to help pull. Try to keep your back flat as you move over a given distance.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Behind Head Chest Stretch',
  'chest - stretching',
  '1. Sit upright on the floor with your partner behind you.
2. Place your hands behind your hand, and push your elbows back as far as you can. Your partner should hold your elbows. This will be your starting position.
3. Gently attempt to pull your elbows forward with your hands still behind your head for 10 or more seconds. Your partner should prevent your elbows from moving.
4. Now, relax your muscles and have your partner gently pull the elbows back as far as it comfortable for you. Be sure to let your partner know when the stretch is adequate to prevent overstretching or injury.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'advanced',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bench Dips',
  'triceps - strength',
  '1. For this exercise you will need to place a bench behind your back. With the bench perpendicular to your body, and while looking away from it, hold on to the bench on its edge with the hands fully extended, separated at shoulder width. The legs will be extended forward, bent at the waist and perpendicular to your torso. This will be your starting position.
2. Slowly lower your body as you inhale by bending at the elbows until you lower yourself far enough to where there is an angle slightly smaller than 90 degrees between the upper arm and the forearm. Tip: Keep the elbows as close as possible throughout the movement. Forearms should always be pointing down.
3. Using your triceps to bring your torso up again, lift yourself back to the starting position.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bench Jump',
  'quadriceps - plyometrics',
  '1. Begin with a box or bench 1-2 feet in front of you. Stand with your feet shoulder width apart. This will be your starting position.
2. Perform a short squat in preparation for the jump; swing your arms behind you.
3. Rebound out of this position, extending through the hips, knees, and ankles to jump as high as possible. Swing your arms forward and up.
4. Jump over the bench, landing with the knees bent, absorbing the impact through the legs.
5. Turn around and face the opposite direction, then jump back over the bench.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bench Press - Powerlifting',
  'triceps - powerlifting',
  '1. Begin by lying on the bench, getting your head beyond the bar if possible. Tuck your feet underneath you and arch your back. Using the bar to help support your weight, lift your shoulder off the bench and retract them, squeezing the shoulder blades together. Use your feet to drive your traps into the bench. Maintain this tight body position throughout the movement.
2. However wide your grip, it should cover the ring on the bar. Pull the bar out of the rack without protracting your shoulders. Focus on squeezing the bar and trying to pull it apart.
3. Lower the bar to your lower chest or upper stomach. The bar, wrist, and elbow should stay in line at all times.
4. Pause when the barbell touches your torso, and then drive the bar up with as much force as possible. The elbows should be tucked in until lockout.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bench Press - With Bands',
  'chest - strength',
  '1. Using a flat bench secure a band under the leg of the bench that is nearest to your head.
2. Once the band is secure, grab it by both handles and lie down on the bench.
3. Extend your arms so that you are holding the band handles in front of you at shoulder width.
4. Once at shoulder width, rotate your wrists forward so that the palms of your hands are facing away from you. This will be your starting position.
5. Bring down the handles slowly until your elbow forms a 90 degree angle. Keep full control at all times.
6. As you breathe out, bring the handles up using your pectoral muscles. Lock your arms in the contracted position, squeeze your chest, hold for a second and then start coming down slowly. Tip: It should take at least twice as long to go down than to come up.
7. Repeat the movement for the prescribed amount of repetitions of your training program.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Elástico/Banda' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bench Press with Chains',
  'triceps - powerlifting',
  '1. Adjust the leader chain, shortening it to the desired length.Place the chains on the sleeves of the bar.
2. Lying on the bench, get your head beyond the bar if possible. Tuck your feet underneath you and arch your back. Using the bar to help support your weight, lift your shoulder off the bench and retract them, squeezing the shoulder blades together. Use your feet to drive your traps into the bench. Maintain this tight body position throughout the movement. However wide your grip, it should cover the ring on the bar.
3. Pull the bar out of the rack without protracting your shoulders. Focus on squeezing the bar and trying to pull it apart. Lower the bar to your lower chest or upper stomach. The bar, wrist, and elbow should stay in line at all times.
4. Pause when the barbell touches your torso, and then drive the bar up with as much force as possible. The elbows should be tucked in until lockout.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bench Sprint',
  'quadriceps - plyometrics',
  '1. Stand on the ground with one foot resting on a bench or box with your heel close to the edge.
2. Push off with your foot on top of the bench, extending through the hip and knee.
3. Land with the opposite foot on top of the box, returning your other foot back to the start position.
4. Continue alternating from one foot to another to complete the set.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bent-Arm Barbell Pullover',
  'lats - strength',
  '1. Lie on a flat bench with a barbell using a shoulder grip width.
2. Hold the bar straight over your chest with a bend in your arms. This will be your starting position.
3. While keeping your arms in the bent arm position, lower the weight slowly in an arc behind your head while breathing in until you feel a stretch on the chest.
4. At that point, bring the barbell back to the starting position using the arc through which the weight was lowered and exhale as you perform this movement.
5. Hold the weight on the initial position for a second and repeat the motion for the prescribed number of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bent-Arm Dumbbell Pullover',
  'chest - strength',
  '1. Place a dumbbell standing up on a flat bench.
2. Ensuring that the dumbbell stays securely placed at the top of the bench, lie perpendicular to the bench (torso across it as in forming a cross) with only your shoulders lying on the surface. Hips should be below the bench and legs bent with feet firmly on the floor. The head will be off the bench as well.
3. Grasp the dumbbell with both hands and hold it straight over your chest with a bend in your arms. Both palms should be pressing against the underside one of the sides of the dumbbell. This will be your starting position. Caution: Always ensure that the dumbbell used for this exercise is secure. Using a dumbbell with loose plates can result in the dumbbell falling apart and falling on your face.
4. While keeping your arms locked in the bent arm position, lower the weight slowly in an arc behind your head while breathing in until you feel a stretch on the chest.
5. At that point, bring the dumbbell back to the starting position using the arc through which the weight was lowered and exhale as you perform this movement.
6. Hold the weight on the initial position for a second and repeat the motion for the prescribed number of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bent-Knee Hip Raise',
  'abdominals - strength',
  '1. Lay flat on the floor with your arms next to your sides.
2. Now bend your knees at around a 75 degree angle and lift your feet off the floor by around 2 inches.
3. Using your lower abs, bring your knees in towards you as you maintain the 75 degree angle bend in your legs. Continue this movement until you raise your hips off of the floor by rolling your pelvis backward. Breathe out as you perform this portion of the movement. Tip: At the end of the movement your knees will be over your chest.
4. Squeeze your abs at the top of the movement for a second and then return to the starting position slowly as you breathe in. Tip: Maintain a controlled motion at all times.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Remada Curvada com Barra',
  'middle back - strength',
  '1. Holding a barbell with a pronated grip (palms facing down), bend your knees slightly and bring your torso forward, by bending at the waist, while keeping the back straight until it is almost parallel to the floor. Tip: Make sure that you keep the head up. The barbell should hang directly in front of you as your arms hang perpendicular to the floor and your torso. This is your starting position.
2. Now, while keeping the torso stationary, breathe out and lift the barbell to you. Keep the elbows close to the body and only use the forearms to hold the weight. At the top contracted position, squeeze the back muscles and hold for a brief pause.
3. Then inhale and slowly lower the barbell back to the starting position.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bent Over Dumbbell Rear Delt Raise With Head On Bench',
  'shoulders - strength',
  '1. Stand up straight while holding a dumbbell in each hand and with an incline bench in front of you.
2. While keeping your back straight and maintaining the natural arch of your back, lean forward until your forehead touches the bench in front of you. Let the arms hang in front of you perpendicular to the ground. The palms of your hands should be facing each other and your torso should be parallel to the floor. This will be your starting position.
3. Keeping your torso forward and stationary, and the arms straight with a slight bend at the elbows, lift the dumbbells straight to the side until both arms are parallel to the floor. Exhale as you lift the weights. Caution: avoid swinging the torso or bringing the arms back as opposed to the side.
4. After a one second contraction at the top, slowly lower the dumbbells back to the starting position.
5. Repeat the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bent Over Low-Pulley Side Lateral',
  'shoulders - strength',
  '1. Select a weight and hold the handle of the low pulley with your right hand.
2. Bend at the waist until your torso is nearly parallel to the floor. Your legs should be slightly bent with your left hand placed on your lower left thigh. Your right arm should be hanging from your shoulder in front of you and with a slight bend at the elbow. This will be your starting position.
3. Raise your right arm, elbow slightly bent, to the side until the arm is parallel to the floor and in line with your right ear. Breathe out as you perform this step.
4. Slowly lower the weight back to the starting position as you breathe in.
5. Repeat for the recommended amount of repetitions and repeat the movement with the other arm.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bent Over One-Arm Long Bar Row',
  'middle back - strength',
  '1. Put weight on one of the ends of an Olympic barbell. Make sure that you either place the other end of the barbell in the corner of two walls; or put a heavy object on the ground so the barbell cannot slide backward.
2. Bend forward until your torso is as close to parallel with the floor as you can and keep your knees slightly bent.
3. Now grab the bar with one arm just behind the plates on the side where the weight was placed and put your other hand on your knee. This will be your starting position.
4. Pull the bar straight up with your elbow in (to maximize back stimulation) until the plates touch your lower chest. Squeeze the back muscles as you lift the weight up and hold for a second at the top of the movement. Breathe out as you lift the weight. Tip: Do not allow for any swinging of the torso. Only the arm should move.
5. Slowly lower the bar to the starting position getting a nice stretch on the lats. Tip: Do not let the plates touch the floor. To ensure the best range of motion, I recommend using small plates (25-lb ones) as opposed to larger plates (like 35-45lb ones).
6. Repeat for the recommended amount of repetitions and switch arms.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bent Over Two-Arm Long Bar Row',
  'middle back - strength',
  '1. Put weight on one of the ends of an Olympic barbell. Make sure that you either place the other end of the barbell in the corner of two walls; or put a heavy object on the ground so the barbell cannot slide backward.
2. Bend forward until your torso is as close to parallel with the floor as you can and keep your knees slightly bent.
3. Now grab the bar with both arms just behind the plates on the side where the weight was placed and put your other hand on your knee. This will be your starting position.
4. Pull the bar straight up with your elbows in (to maximize back stimulation) until the plates touch your lower chest. Squeeze the back muscles as you lift the weight up and hold for a second at the top of the movement. Breathe out as you lift the weight. Tip: Use a stirrup or double handle cable attachment by hooking it under the end of the bar.
5. Slowly lower the bar to the starting position getting a nice stretch on the lats. Tip: Do not let the plates touch the floor. To ensure the best range of motion, I recommend using small plates (25-lb ones) as opposed to larger plates (like 35-45lb ones).
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bent Over Two-Dumbbell Row',
  'middle back - strength',
  '1. With a dumbbell in each hand (palms facing your torso), bend your knees slightly and bring your torso forward by bending at the waist; as you bend make sure to keep your back straight until it is almost parallel to the floor. Tip: Make sure that you keep the head up. The weights should hang directly in front of you as your arms hang perpendicular to the floor and your torso. This is your starting position.
2. While keeping the torso stationary, lift the dumbbells to your side (as you breathe out), keeping the elbows close to the body (do not exert any force with the forearm other than holding the weights). On the top contracted position, squeeze the back muscles and hold for a second.
3. Slowly lower the weight again to the starting position as you inhale.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bent Over Two-Dumbbell Row With Palms In',
  'middle back - strength',
  '1. With a dumbbell in each hand (palms facing each other), bend your knees slightly and bring your torso forward, by bending at the waist, while keeping the back straight until it is almost parallel to the floor. Tip: Make sure that you keep the head up. The weights should hang directly in front of you as your arms hang perpendicular to the floor and your torso. This is your starting position.
2. While keeping the torso stationary, lift the dumbbells to your side as you breathe out, squeezing your shoulder blades together. On the top contracted position, squeeze the back muscles and hold for a second.
3. Slowly lower the weight again to the starting position as you inhale.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bent Press',
  'abdominals - strength',
  '1. Clean a kettlebell to your shoulder. Clean the kettlebell to your shoulders by extending through the legs and hips as you raise the kettlebell towards your shoulder. The wrist should rotate as you do so. This will be your starting position.
2. Begin my leaning to the side opposite the kettlebell, continuing until you are able to touch the ground with your free hand, keeping your eyes on the kettlebell. As you do so, press the weight vertically be extending through the elbow, keeping your arm perpendicular to the ground.
3. Return to an upright position, with the kettlebell above your head. Return the kettlebell to the shoulder and repeat for the desired number of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bicycling',
  'quadriceps - cardio',
  '1. To begin, seat yourself on the bike and adjust the seat to your height.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'cardio',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bicycling, Stationary',
  'quadriceps - cardio',
  '1. To begin, seat yourself on the bike and adjust the seat to your height.
2. Select the desired option from the menu. You may have to start pedaling to turn it on. You can use the manual setting, or you can select a program to use. Typically, you can enter your age and weight to estimate the amount of calories burned during exercise. The level of resistance can be changed throughout the workout. The handles can be used to monitor your heart rate to help you stay at an appropriate intensity.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'cardio',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Board Press',
  'triceps - powerlifting',
  '1. Begin by lying on the bench, getting your head beyond the bar if possible. One to five boards, made out of 2x6''s, can be screwed together and held in place by a training partner, bands, or just tucked under your shirt.
2. Tuck your feet underneath you and arch your back. Using the bar to help support your weight, lift your shoulder off the bench and retract them, squeezing the shoulder blades together. Use your feet to drive your traps into the bench. Maintain this tight body position throughout the movement.
3. You can take a standard bench grip, or shoulder width to focus on the triceps. Pull the bar out of the rack without protracting your shoulders. The bar, wrist, and elbow should stay in line at all times. Focus on squeezing the bar and trying to pull it apart.
4. Lower the bar to the boards, and then drive the bar up with as much force as possible. The elbows should be tucked in until lockout.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Body-Up',
  'triceps - strength',
  '1. Assume a plank position on the ground. You should be supporting your bodyweight on your toes and forearms, keeping your torso straight. Your forearms should be shoulder-width apart. This will be your starting position.
2. Pressing your palms firmly into the ground, extend through the elbows to raise your body from the ground. Keep your torso rigid as you perform the movement.
3. Slowly lower your forearms back to the ground by allowing the elbows to flex.
4. Repeat.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Body Tricep Press',
  'triceps - strength',
  '1. Position a bar in a rack at chest height.
2. Standing, take a shoulder width grip on the bar and step a yard or two back, feet together and arms extended so that you are leaning on the bar. This will be your starting position.
3. Begin by flexing the elbow, lowering yourself towards the bar.
4. Pause, and then reverse the motion by extending the elbows.
5. Progress from bodyweight by adding chains over your shoulders.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bodyweight Flyes',
  'chest - strength',
  '1. Position two equally loaded EZ bars on the ground next to each other. Ensure they are able to roll.
2. Assume a push-up position over the bars, supporting your weight on your toes and hands with your arms extended and body straight.
3. Place your hands on the bars. This will be your starting position.
4. Using a slow and controlled motion, move your hands away from the midline of your body, rolling the bars apart. Inhale during this portion of the motion.
5. After moving the bars as far apart as you can, return to the starting position by pulling them back together. Exhale as you perform this movement.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bodyweight Mid Row',
  'middle back - strength',
  '1. Begin by taking a medium to wide grip on a pull-up apparatus with your palms facing away from you. From a hanging position, tuck your knees to your chest, leaning back and getting your legs over your side of the pull-up apparatus. This will be your starting position.
2. Beginning with your arms straight, flex the elbows and retract the shoulder blades to raise your body up until your legs contact the pull-up apparatus.
3. After a brief pause, return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bodyweight Squat',
  'quadriceps - strength',
  '1. Stand with your feet shoulder width apart. You can place your hands behind your head. This will be your starting position.
2. Begin the movement by flexing your knees and hips, sitting back with your hips.
3. Continue down to full depth if you are able,and quickly reverse the motion until you return to the starting position. As you squat, keep your head and chest up and push your knees out.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bodyweight Walking Lunge',
  'quadriceps - strength',
  '1. Begin standing with your feet shoulder width apart and your hands on your hips.
2. Step forward with one leg, flexing the knees to drop your hips. Descend until your rear knee nearly touches the ground. Your posture should remain upright, and your front knee should stay above the front foot.
3. Drive through the heel of your lead foot and extend both knees to raise yourself back up.
4. Step forward with your rear foot, repeating the lunge on the opposite leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bosu Ball Cable Crunch With Side Bends',
  'abdominals - strength',
  '1. Connect a standard handle to each arm of a cable machine, and position them in the most downward position.
2. Grab a Bosu Ball and position it in front and center of the cable machine.
3. Lie down on the Bosu Ball with the small of your back arched around the ball. Your rear end should be close to the floor without touching it.
4. With both hands, reach back and grab the handle of each cable.
5. With your feet positioned in a wide stance, extend your arms straight out in front of you and in between your knees. Your hands should be at knee level.
6. Keep your arms straight and in-line with the upward angle of the cable. Elevate your torso in a crunching motion without dropping or bending your arms.
7. Maintain the rigid position with your arms. Slowly descend back to the starting position with your back arched around the Bosu Ball and your abdominals elongated.
8. Repeat the same series of movements to failure.
9. Once you reach failure, keep your abs tight and raise your torso into plank position so your back is elevated off the Bosu Ball.
10. Lower your arms down to your side; keep them straight. Start doing alternating side bends; reach for your heels! This finishing movement will focus on your obliques.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bottoms-Up Clean From The Hang Position',
  'forearms - strength',
  '1. Initiate the exercise by standing upright with a kettlebell in one hand.
2. Swing the kettlebell back forcefully and then reverse the motion forcefully. Crush the kettlebell handle as hard as possible and raise the kettlebell to your shoulder.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Antebraço' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bottoms Up',
  'abdominals - strength',
  '1. Begin by lying on your back on the ground. Your legs should be straight and your arms at your side. This will be your starting position.
2. To perform the movement, tuck the knees toward your chest by flexing the hips and knees. Following this, extend your legs directly above you so that they are perpendicular to the ground. Rotate and elevate your pelvis to raise your glutes from the floor.
3. After a brief pause, return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Box Jump (Multiple Response)',
  'hamstrings - plyometrics',
  '1. Assume a relaxed stance facing the box or platform approximately an arm''s length away. Arms should be down at the sides and legs slightly bent.
2. Using the arms to aid in the initial burst, jump upward and forward, landing with feet simultaneously on top of the box or platform.
3. Immediately drop or jump back down to the original starting place; then repeat the sequence.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Box Skip',
  'hamstrings - plyometrics',
  '1. You will need several boxes lined up about 8 feet apart.
2. Begin facing the first box with one leg slightly behind the other.
3. Drive off the back leg, attempting to gain as much height with the hips as possible.
4. Immediately upon landing on the box, drive the other leg forward and upward to gain height and distance, leaping from the box. Land between the first two boxes with the same leg that landed on the first box.
5. Then, step to the next box and repeat.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Box Squat',
  'quadriceps - powerlifting',
  '1. The box squat allows you to squat to desired depth and develop explosive strength in the squat movement. Begin in a power rack with a box at the appropriate height behind you. Typically, you would aim for a box height that brings you to a parallel squat, but you can train higher or lower if desired.
2. Begin by stepping under the bar and placing it across the back of the shoulders. Squeeze your shoulder blades together and rotate your elbows forward, attempting to bend the bar across your shoulders. Remove the bar from the rack, creating a tight arch in your lower back, and step back into position. Place your feet wider for more emphasis on the back, glutes, adductors, and hamstrings, or closer together for more quad development. Keep your head facing forward.
3. With your back, shoulders, and core tight, push your knees and butt out and you begin your descent. Sit back with your hips until you are seated on the box. Ideally, your shins should be perpendicular to the ground. Pause when you reach the box, and relax the hip flexors. Never bounce off of a box.
4. Keeping the weight on your heels and pushing your feet and knees out, drive upward off of the box as you lead the movement with your head. Continue upward, maintaining tightness head to toe.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Box Squat with Bands',
  'quadriceps - powerlifting',
  '1. Begin in a power rack with a box at the appropriate height behind you. Set up the bands on the sleeves, secured to either band pegs, the rack, or dumbbells so that there is appropriate tension. If dumbbells are used, secure them so that they don''t move. Also, ensure that the dumbbells you are using are heavy enough for the bands that you are using. Additional plates can be used to hold the dumbbells down. If more tension is needed, you can either widen the base on the floor or choke the bands. Typically, you would aim for a box height that brings you to a parallel squat, but you can train higher or lower if desired.
2. Begin by stepping under the bar and placing it across the back of the shoulders. Squeeze your shoulder blades together and rotate your elbows forward, attempting to bend the bar across your shoulders. Remove the bar from the rack, creating a tight arch in your lower back, and step back into position. Place your feet wider for more emphasis on the back, glutes, adductors, and hamstrings, or closer together for more quad development. Keep your head facing forward.
3. With your back, shoulders, and core tight, push your knees and butt out and you begin your descent. Sit back with your hips until you are seated on the box. Ideally, your shins should be perpendicular to the ground. Pause when you reach the box, and relax the hip flexors. Never bounce off of a box.
4. Keeping the weight on your heels and pushing your feet and knees out, drive upward off of the box as you lead the movement with your head. Continue upward, maintaining tightness head to toe. Use care to return the barbell to the rack.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Box Squat with Chains',
  'quadriceps - strength',
  '1. Begin in a power rack with a box at the appropriate height behind you. Typically, you would aim for a box height that brings you to a parallel squat, but you can train higher or lower if desired.
2. To set up the chains, begin by looping the leader chain over the sleeves of the bar. The heavy chain should be attached using a snap hook. Adjust the length of the lead chain so that a few links are still on the floor at the top of the movement.
3. Begin by stepping under the bar and placing it across the back of the shoulders. Squeeze your shoulder blades together and rotate your elbows forward, attempting to bend the bar across your shoulders. Remove the bar from the rack, creating a tight arch in your lower back, and step back into position. Place your feet wider for more emphasis on the back, glutes, adductors, and hamstrings, or closer together for more quad development. Keep your head facing forward.
4. With your back, shoulders, and core tight, push your knees and butt out and you begin your descent. Sit back with your hips until you are seated on the box. Ideally, your shins should be perpendicular to the ground. Pause when you reach the box, and relax the hip flexors. Never bounce off of a box.
5. Keeping the weight on your heels and pushing your feet and knees out, drive upward off of the box as you lead the movement with your head. Continue upward, maintaining tightness head to toe.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Brachialis-SMR',
  'biceps - stretching',
  '1. Lie on your side, with your upper arm against the foam roller. The upper arm should be more or less aligned with your body, with the outside of the bicep pressed against the foam roller.
2. Raise your hips off of the floor, supporting your weight on your arm and on your feet. Hold for 10-30 seconds, and then switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Rolo de Espuma' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Bradford/Rocky Presses',
  'shoulders - strength',
  '1. Sit on a Military Press Bench with a bar at shoulder level with a pronated grip (palms facing forward). Tip: Your grip should be wider than shoulder width and it should create a 90-degree angle between the forearm and the upper arm as the barbell goes down. This is your starting position.
2. Once you pick up the barbell with the correct grip, lift the bar up over your head by locking your arms.
3. Now lower the bar down to the back of the head slowly as you inhale.
4. Lift the bar back up to the starting position as you exhale.
5. Lower the bar down to the starting position slowly as you inhale. This is one repetition.
6. Alternate in this manner until you complete the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Butt-Ups',
  'abdominals - strength',
  '1. Begin a pushup position but with your elbows on the ground and resting on your forearms. Your arms should be bent at a 90 degree angle.
2. Arch your back slightly out rather than keeping your back completely straight.
3. Raise your glutes toward the ceiling, squeezing your abs tightly to close the distance between your ribcage and hips. The end result will be that you''ll end up in a high bridge position. Exhale as you perform this portion of the movement.
4. Lower back down slowly to your starting position as you breathe in. Tip: Don''t let your back sag downwards.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Butt Lift (Bridge)',
  'glutes - strength',
  '1. Lie flat on the floor on your back with the hands by your side and your knees bent. Your feet should be placed around shoulder width. This will be your starting position.
2. Pushing mainly with your heels, lift your hips off the floor while keeping your back straight. Breathe out as you perform this part of the motion and hold at the top for a second.
3. Slowly go back to the starting position as you breathe in.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Butterfly',
  'chest - strength',
  '1. Sit on the machine with your back flat on the pad.
2. Take hold of the handles. Tip: Your upper arms should be positioned parallel to the floor; adjust the machine accordingly. This will be your starting position.
3. Push the handles together slowly as you squeeze your chest in the middle. Breathe out during this part of the motion and hold the contraction for a second.
4. Return back to the starting position slowly as you inhale until your chest muscles are fully stretched.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cable Chest Press',
  'chest - strength',
  '1. Adjust the weight to an appropriate amount and be seated, grasping the handles. Your upper arms should be about 45 degrees to the body, with your head and chest up. The elbows should be bent to about 90 degrees. This will be your starting position.
2. Begin by extending through the elbow, pressing the handles together straight in front of you. Keep your shoulder blades retracted as you execute the movement.
3. After pausing at full extension, return to th starting position, keeping tension on the cables.
4. You can also execute this movement with your back off the pad, at an incline or decline, or alternate hands.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Crossover no Cabo',
  'chest - strength',
  '1. To get yourself into the starting position, place the pulleys on a high position (above your head), select the resistance to be used and hold the pulleys in each hand.
2. Step forward in front of an imaginary straight line between both pulleys while pulling your arms together in front of you. Your torso should have a small forward bend from the waist. This will be your starting position.
3. With a slight bend on your elbows in order to prevent stress at the biceps tendon, extend your arms to the side (straight out at both sides) in a wide arc until you feel a stretch on your chest. Breathe in as you perform this portion of the movement. Tip: Keep in mind that throughout the movement, the arms and torso should remain stationary; the movement should only occur at the shoulder joint.
4. Return your arms back to the starting position as you breathe out. Make sure to use the same arc of motion used to lower the weights.
5. Hold for a second at the starting position and repeat the movement for the prescribed amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cable Crunch',
  'abdominals - strength',
  '1. Kneel below a high pulley that contains a rope attachment.
2. Grasp cable rope attachment and lower the rope until your hands are placed next to your face.
3. Flex your hips slightly and allow the weight to hyperextend the lower back. This will be your starting position.
4. With the hips stationary, flex the waist as you contract the abs so that the elbows travel towards the middle of the thighs. Exhale as you perform this portion of the movement and hold the contraction for a second.
5. Slowly return to the starting position as you inhale. Tip: Make sure that you keep constant tension on the abs throughout the movement. Also, do not choose a weight so heavy that the lower back handles the brunt of the work.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cable Deadlifts',
  'quadriceps - strength',
  '1. Move the cables to the bottom of the towers and select an appropriate weight. Stand directly in between the uprights.
2. To begin, squat down be flexing your hips and knees until you can reach the handles.
3. After grasping them, begin your ascent. Driving through your heels extend your hips and knees keeping your hands hanging at your side. Keep your head and chest up throughout the movement.
4. After reaching a full standing position, Return to the starting position and repeat.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cable Hammer Curls - Rope Attachment',
  'biceps - strength',
  '1. Attach a rope attachment to a low pulley and stand facing the machine about 12 inches away from it.
2. Grasp the rope with a neutral (palms-in) grip and stand straight up keeping the natural arch of the back and your torso stationary.
3. Put your elbows in by your side and keep them there stationary during the entire movement. Tip: Only the forearms should move; not your upper arms. This will be your starting position.
4. Using your biceps, pull your arms up as you exhale until your biceps touch your forearms. Tip: Remember to keep the elbows in and your upper arms stationary.
5. After a 1 second contraction where you squeeze your biceps, slowly start to bring the weight back to the original position.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cable Hip Adduction',
  'quadriceps - strength',
  '1. Stand in front of a low pulley facing forward with one leg next to the pulley and the other one away.
2. Attach the ankle cuff to the cable and also to the ankle of the leg that is next to the pulley.
3. Now step out and away from the stack with a wide stance and grasp the bar of the pulley system.
4. Stand on the foot that does not have the ankle cuff (the far foot) and allow the leg with the cuff to be pulled towards the low pulley. This will be your starting position.
5. Now perform the movement by moving the leg with the ankle cuff in front of the far leg by using the inner thighs to abduct the hip. Breathe out during this portion of the movement.
6. Slowly return to the starting position as you breathe in.
7. Repeat for the recommended amount of repetitions and then repeat the same movement with the opposite leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cable Incline Pushdown',
  'lats - strength',
  '1. Lie on incline an bench facing away from a high pulley machine that has a straight bar attachment on it.
2. Grasp the straight bar attachment overhead with a pronated (overhand; palms down) shoulder width grip and extend your arms in front of you. The bar should be around 2 inches away from your upper thighs. This will be your starting position.
3. Keeping the upper arms stationary, lift your arms back in a semi circle until the bar is straight over your head. Breathe in during this portion of the movement.
4. Slowly go back to the starting position using your lats and hold the contraction once you reach the starting position. Breathe out during the execution of this movement.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cable Incline Triceps Extension',
  'triceps - strength',
  '1. Lie on incline an bench facing away from a high pulley machine that has a straight bar attachment on it.
2. Grasp the straight bar attachment overhead with a pronated (overhand; palms down) narrow grip (less than shoulder width) and keep your elbows tucked in to your sides. Your upper arms should create around a 25 degree angle when measured from the floor.
3. Keeping the upper arms stationary, extend the arms as you flex the triceps. Breathe out during this portion of the movement and hold the contraction for a second.
4. Slowly go back to the starting position.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cable Internal Rotation',
  'shoulders - strength',
  '1. Sit next to a low pulley sideways (with legs stretched in front of you or crossed) and grasp the single hand cable attachment with the arm nearest to the cable. Tip: If you can adjust the pulley''s height, you can use a flat bench to sit on instead.
2. Position the elbow against your side with the elbow bent at 90° and the arm pointing towards the pulley. This will be your starting position.
3. Pull the single hand cable attachment toward your body by internally rotating your shoulder until your forearm is across your abs. You will be creating an imaginary semi-circle. Tip: The forearm should be perpendicular to your torso at all times.
4. Slowly go back to the initial position.
5. Repeat for the recommended amount of repetitions and then repeat the movement with the next arm.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cable Iron Cross',
  'chest - strength',
  '1. Begin by moving the pulleys to the high position, select the resistance to be used, and take a handle in each hand.
2. Stand directly between both pulleys with your arms extended out to your sides. Your head and chest should be up while your arms form a "T". This will be your starting position.
3. Keeping the elbows extended, pull your arms straight to your sides.
4. Return your arms back to the starting position after a pause at the peak contraction.
5. Continue the movement for the prescribed number of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cable Judo Flip',
  'abdominals - strength',
  '1. Connect a rope attachment to a tower, and move the cable to the lowest pulley position. Stand with your side to the cable with a wide stance, and grab the rope with both hands.
2. Twist your body away from the pulley as you bring the rope over your shoulder like you''re performing a judo flip.
3. Shift your weight between your feet as you twist and crunch forward, pulling the cable downward.
4. Return to the starting position and repeat until failure.
5. Then, reposition and repeat the same series of movements on the opposite side.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cable Lying Triceps Extension',
  'triceps - strength',
  '1. Lie on a flat bench and grasp the straight bar attachment of a low pulley with a narrow overhand grip. Tip: The easiest way to do this is to have someone hand you the bar as you lay down.
2. With your arms extended, position the bar over your torso. Your arms and your torso should create a 90-degree angle. This will be your starting position.
3. Lower the bar by bending at the elbow while keeping the upper arms stationary and elbows in. Go down until the bar lightly touches your forehead. Breathe in as you perform this portion of the movement.
4. Flex the triceps as you lift the bar back to its starting position. Exhale as you perform this portion of the movement.
5. Hold for a second at the contracted position and repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cable One Arm Tricep Extension',
  'triceps - strength',
  '1. With your right hand, grasp a single handle attached to the high-cable pulley using a supinated (underhand; palms facing up) grip. You should be standing directly in front of the weight stack.
2. Now pull the handle down so that your upper arm and elbow are locked in to the side of your body. Your upper arm and forearm should form an acute angle (less than 90-degrees). You can keep the other arm by the waist and you can have one leg in front of you and the other one back for better balance. This will be your starting position.
3. As you contract the triceps, move the single handle attachment down to your side until your arm is straight. Breathe out as you perform this movement. Tip: Only the forearms should move. Your upper arms should remain stationary at all times.
4. Squeeze the triceps and hold for a second in this contracted position.
5. Slowly return the handle to the starting position.
6. Repeat for the recommended amount of repetitions and then perform the same movement with the other arm.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cable Preacher Curl',
  'biceps - strength',
  '1. Place a preacher bench about 2 feet in front of a pulley machine.
2. Attach a straight bar to the low pulley.
3. Sit at the preacher bench with your elbow and upper arms firmly on top of the bench pad and have someone hand you the bar from the low pulley.
4. Grab the bar and fully extend your arms on top of the preacher bench pad. This will be your starting position.
5. Now start pilling the weight up towards your shoulders and squeeze the biceps hard at the top of the movement. Exhale as you perform this motion. Also, hold for a second at the top.
6. Now slowly lower the weight to the starting position.
7. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cable Rear Delt Fly',
  'shoulders - strength',
  '1. Adjust the pulleys to the appropriate height and adjust the weight. The pulleys should be above your head.
2. Grab the left pulley with your right hand and the right pulley with your left hand, crossing them in front of you. This will be your starting position.
3. Initiate the movement by moving your arms back and outward, keeping your arms straight as you execute the movement.
4. Pause at the end of the motion before returning the handles to the start position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cable Reverse Crunch',
  'abdominals - strength',
  '1. Connect an ankle strap attachment to a low pulley cable and position a mat on the floor in front of it.
2. Sit down with your feet toward the pulley and attach the cable to your ankles.
3. Lie down, elevate your legs and bend your knees at a 90-degree angle. Your legs and the cable should be aligned. If not, adjust the pulley up or down until they are.
4. With your hands behind your head, bring your knees inward to your torso and elevate your hips off the floor.
5. Pause for a moment and in a slow and controlled manner drop your hips and bring your legs back to the starting 90-degree angle. You should still have tension on your abs in the resting position.
6. Repeat the same movement to failure.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cable Rope Overhead Triceps Extension',
  'triceps - strength',
  '1. Attach a rope to the bottom pulley of the pulley machine.
2. Grasping the rope with both hands, extend your arms with your hands directly above your head using a neutral grip (palms facing each other). Your elbows should be in close to your head and the arms should be perpendicular to the floor with the knuckles aimed at the ceiling. This will be your starting position.
3. Slowly lower the rope behind your head as you hold the upper arms stationary. Inhale as you perform this movement and pause when your triceps are fully stretched.
4. Return to the starting position by flexing your triceps as you breathe out.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cable Rope Rear-Delt Rows',
  'shoulders - strength',
  '1. Sit in the same position on a low pulley row station as you would if you were doing seated cable rows for the back.
2. Attach a rope to the pulley and grasp it with an overhand grip. Your arms should be extended and parallel to the floor with the elbows flared out.
3. Keep your lower back upright and slide your hips back so that your knees are slightly bent. This will be your starting position.
4. Pull the cable attachment towards your upper chest, just below the neck, as you keep your elbows up and out to the sides. Continue this motion as you exhale until the elbows travel slightly behind the back. Tip: Keep your upper arms horizontal, perpendicular to the torso and parallel to the floor throughout the motion.
5. Go back to the initial position where the arms are extended and the shoulders are stretched forward. Inhale as you perform this portion of the movement.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cable Russian Twists',
  'abdominals - strength',
  '1. Connect a standard handle attachment, and position the cable to a middle pulley position.
2. Lie on a stability ball perpendicular to the cable and grab the handle with one hand. You should be approximately arm''s length away from the pulley, with the tension of the weight on the cable.
3. Grab the handle with both hands and fully extend your arms above your chest. You hands should be directly in-line with the pulley. If not, adjust the pulley up or down until they are.
4. Keep your hips elevated and abs engaged. Rotate your torso away from the pulley for a full-quarter rotation. Your body should be flat from head to knees.
5. Pause for a moment and in a slow and controlled manner reset to the starting position. You should still have side tension on the cable in the resting position.
6. Repeat the same movement to failure.
7. Then, reposition and repeat the same series of movements on the opposite side.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cable Seated Crunch',
  'abdominals - strength',
  '1. Seat on a flat bench with your back facing a high pulley.
2. Grasp the cable rope attachment with both hands (with the palms of the hands facing each other) and place your hands securely over both shoulders. Tip: Allow the weight to hyperextend the lower back slightly. This will be your starting position.
3. With the hips stationary, flex the waist so the elbows travel toward the hips. Breathe out as you perform this step.
4. As you inhale, go back to the initial position slowly.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cable Seated Lateral Raise',
  'shoulders - strength',
  '1. Stand in the middle of two low pulleys that are opposite to each other and place a flat bench right behind you (in perpendicular fashion to you; the narrow edge of the bench should be the one behind you). Select the weight to be used on each pulley.
2. Now sit at the edge of the flat bench behind you with your feet placed in front of your knees.
3. Bend forward while keeping your back flat and rest your torso on the thighs.
4. Have someone give you the single handles attached to the pulleys. Grasp the left pulley with the right hand and the right pulley with the left after you select your weight. The pulleys should run under your knees and your arms will be extended with palms facing each other and a slight bend at the elbows. This will be the starting position.
5. While keeping the arms stationary, raise the upper arms to the sides until they are parallel to the floor and at shoulder height. Exhale during the execution of this movement and hold the contraction for a second.
6. Slowly lower your arms to the starting position as you inhale.
7. Repeat for the recommended amount of repetitions. Tip: Maintain upper arms perpendicular to torso and a fixed elbow position (10 degree to 30 degree angle) throughout exercise.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cable Shoulder Press',
  'shoulders - strength',
  '1. Move the cables to the bottom of the towers and select an appropriate weight.
2. Stand directly in between the uprights. Grasp the cables and hold them at shoulder height, palms facing forward. This will be your starting position.
3. Keeping your head and chest up, extend through the elbow to press the handles directly over head.
4. After pausing at the top, return to the starting position and repeat.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cable Shrugs',
  'traps - strength',
  '1. Grasp a cable bar attachment that is attached to a low pulley with a shoulder width or slightly wider overhand (palms facing down) grip.
2. Stand erect close to the pulley with your arms extended in front of you holding the bar. This will be your starting position.
3. Lift the bar by elevating the shoulders as high as possible as you exhale. Hold the contraction at the top for a second. Tip: The arms should remain extended at all times. Refrain from using the biceps to help lift the bar. Only the shoulders should be moving up and down.
4. Lower the bar back to the original position.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Trapézio' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cable Wrist Curl',
  'forearms - strength',
  '1. Start out by placing a flat bench in front of a low pulley cable that has a straight bar attachment.
2. Use your arms to grab the cable bar with a narrow to shoulder width supinated grip (palms up) and bring them up so that your forearms are resting against the top of your thighs. Your wrists should be hanging just beyond your knees.
3. Start out by curling your wrist upwards and exhaling. Keep the contraction for a second.
4. Slowly lower your wrists back down to the starting position while inhaling.
5. Your forearms should be stationary as your wrist is the only movement needed to perform this exercise.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Antebraço' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Calf-Machine Shoulder Shrug',
  'traps - strength',
  '1. Position yourself on the calf machine so that the shoulder pads are above your shoulders. Your torso should be straight with the arms extended normally by your side. This will be your starting position.
2. Raise your shoulders up towards your ears as you exhale and hold the contraction for a full second.
3. Slowly return to the starting position as you inhale.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Trapézio' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Calf Press',
  'calves - strength',
  '1. Adjust the seat so that your legs are only slightly bent in the start position. The balls of your feet should be firmly on the platform.
2. Select an appropriate weight, and grasp the handles. This will be your starting position.
3. Straighten the legs by extending the knees, just barely lifting the weight from the stack. Your ankle should be fully flexed, toes pointing up. Execute the movement by pressing downward through the balls of your feet as far as possible.
4. After a brief pause, reverse the motion and repeat.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Panturrilha' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Calf Press On The Leg Press Machine',
  'calves - strength',
  '1. Using a leg press machine, sit down on the machine and place your legs on the platform directly in front of you at a medium (shoulder width) foot stance.
2. Lower the safety bars holding the weighted platform in place and press the platform all the way up until your legs are fully extended in front of you without locking your knees. (Note: In some leg press units you can leave the safety bars on for increased safety. If your leg press unit allows for this, then this is the preferred method of performing the exercise.) Your torso and the legs should make perfect 90-degree angle. Now carefully place your toes and balls of your feet on the lower portion of the platform with the heels extending off. Toes should be facing forward, outwards or inwards as described at the beginning of the chapter. This will be your starting position.
3. Press on the platform by raising your heels as you breathe out by extending your ankles as high as possible and flexing your calf. Ensure that the knee is kept stationary at all times. There should be no bending at any time. Hold the contracted position by a second before you start to go back down.
4. Go back slowly to the starting position as you breathe in by lowering your heels as you bend the ankles until calves are stretched.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Panturrilha' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Calf Raise On A Dumbbell',
  'calves - strength',
  '1. Hang on to a sturdy object for balance and stand on a dumbbell handle, preferably one with round plates so that it rolls as in this manner you have to work harder to stabilize yourself; thus increasing the effectiveness of the exercise.
2. Now roll your foot slightly forward so that you can get a nice stretch of the calf. This will be your starting position.
3. Lift the calf as you roll your foot over the top of the handle so that you get a full extension. Exhale during the execution of this movement. Contract the calf hard at the top and hold for a second. Tip: As you come up, roll the dumbbell slightly backward.
4. Now inhale as you roll the dumbbell slightly forward as you come down to get a better stretch.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Panturrilha' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Calf Raises - With Bands',
  'calves - strength',
  '1. Grab an exercise band and stand on it with your toes making sure that the length of the band between the foot and the arms is the same for both sides.
2. While holding the handles of the band, raise the arms to the side of your head as if you were getting ready to perform a shoulder press. The palms should be facing forward with the elbows bent and to the sides. This movement will create tension on the band. This will be your starting position.
3. Keeping the hands by your shoulder, stand up on your toes as you exhale and contract the calves hard at the top of the movement.
4. After a one second contraction, slowly go back down to the starting position.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Panturrilha' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Elástico/Banda' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Calf Stretch Elbows Against Wall',
  'calves - stretching',
  '1. Stand facing a wall from a couple feet away.
2. Lean against the wall, placing your weight on your forearms.
3. Attempt to keep your heels on the ground. Hold for 10-20 seconds. You may move further or closer the wall, making it more or less difficult, respectively.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Panturrilha' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Calf Stretch Hands Against Wall',
  'calves - stretching',
  '1. Stand facing a wall from several feet away. Stagger your stance, placing one foot forward.
2. Lean forward and rest your hands on the wall, keeping your heel, hip and head in a straight line.
3. Attempt to keep your heel on the ground. Hold for 10-20 seconds and then switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Panturrilha' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Calves-SMR',
  'calves - stretching',
  '1. Begin seated on the floor. Place a foam roller underneath your lower leg. Your other leg can either be crossed over the opposite or be placed on the floor, supporting some of your weight. This will be your starting position.
2. Place your hands to your side or just behind you, and press down to raise your hips off of the floor, placing much of your weight against your calf muscle. Roll from below the knee to above the ankle, pausing at points of tension for 10-30 seconds. Repeat for the other leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Panturrilha' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Rolo de Espuma' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Car Deadlift',
  'quadriceps - strongman',
  '1. This event apparatus typically has neutral grip handles, however some have a straight bar that you can approach like a normal deadlift. The apparatus can be loaded with a vehicle or other heavy objects such as tractor tires or kegs.
2. Center yourself between the handles if you are a strong squatter, or back a couple inches if you are a strong deadlifter. You feet should be about hip width apart. Bend at the hip to grip the handles. With your feet and your grip set, take a big breath and then lower your hips and flex the knees.
3. Look forward with your head, keep your chest up and your back arched, and begin driving through the heels to move the weight upward. As the weight comes up, pull your shoulder blades together as you drive your hips forward.
4. Lower the weight by bending at the hips and guiding it to the floor.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Car Drivers',
  'shoulders - strength',
  '1. While standing upright, hold a barbell plate in both hands at the 3 and 9 o''clock positions. Your palms should be facing each other and your arms should be extended straight out in front of you. This will be your starting position.
2. Initiate the movement by rotating the plate as far to one side as possible. Use the same type of movement you would use to turn a steering wheel to one side.
3. Reverse the motion, turning it all the way to the opposite side.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Carioca Quick Step',
  'adductors - plyometrics',
  '1. Begin with your feet a few inches apart and your left arm up in a relaxed, athletic position.
2. With your right foot, quick step behind and pull the knee up.
3. Fire your arms back up when you pull the right knee, being sure that your knee goes straight up and down. Avoid turning your feet as you move and continue to look forward as you move to the side.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cat Stretch',
  'lower back - stretching',
  '1. Position yourself on the floor on your hands and knees.
2. Pull your belly in and round your spine, lower back, shoulders, and neck, letting your head drop.
3. Hold for 15 seconds.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Catch and Overhead Throw',
  'lats - plyometrics',
  '1. Begin standing while facing a wall or a partner.
2. Using both hands, position the ball behind your head, stretching as much as possible, and forcefully throw the ball forward.
3. Ensure that you follow your throw through, being prepared to receive your rebound from your throw. If you are throwing against the wall, make sure that you stand close enough to the wall to receive the rebound, and aim a little higher than you would with a partner.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Chain Handle Extension',
  'triceps - powerlifting',
  '1. You will need two cable handle attachments and a flat bench, as well as chains, for this exercise. Clip the middle of the chains to the handles, and position yourself on the flat bench. Your elbows should be pointing straight up.
2. Begin by extending through the elbow, keeping your upper arm still, with your wrists pronated.
3. Pause at the lockout, and reverse the motion to return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Chain Press',
  'chest - powerlifting',
  '1. Begin by connecting the chains to the cable handle attachments. Position yourself on the flat bench in the same position as for a dumbbell press. Your wrists should be pronated and arms perpendicular to the floor. This will be your starting position.
2. Lower the chains by flexing the elbows, unloading some of the chain onto the floor.
3. Continue until your elbow forms a 90 degree angle, and then reverse the motion by extending through the elbow to lockout.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Chair Leg Extended Stretch',
  'hamstrings - stretching',
  '1. Sit upright in a chair and grip the seat on the sides.
2. Raise one leg, extending the knee, flexing the ankle as you do so.
3. Slowly move that leg outward as far as you can, and then back to the center and down.
4. Repeat for your other leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Chair Lower Back Stretch',
  'lats - stretching',
  '1. Sit upright on a chair.
2. Bend to one side with your arm over your head. You can hold onto the chair with your free hand.
3. Hold for 10 seconds, and repeat for your other side.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Chair Squat',
  'quadriceps - strength',
  '1. To begin, first set the bar to a position that best matches your height. Once the bar is loaded, step under it and position it across the back of your shoulders.
2. Take the bar with your hands facing forward, unlock it and lift it off the rack by extending your legs.
3. Move your feet forward about 18 inches in front of the bar. Position your legs using a shoulder width stance with the toes slightly pointed out. Look forward at all times and maintain a neutral or slightly arched spine. This will be your starting position.
4. Slowly lower the bar by bending the knees as you maintain a straight posture with the head up. Continue down until the angle between the upper and lower leg breaks 90 degrees.
5. Begin to raise the bar as you exhale by pushing the floor with the heels of your feet, extending the knees and returning to the starting position.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Chair Upper Body Stretch',
  'shoulders - stretching',
  '1. Sit on the edge of a chair, gripping the back of it.
2. Straighten your arms, keeping your back straight, and pull your upper body forward so you feel a stretch. Hold for 20-30 seconds.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Chest And Front Of Shoulder Stretch',
  'chest - stretching',
  '1. Start off by standing with your legs together, holding a bodybar or a broomstick.
2. Take a slightly wider than shoulder width grip on the pole and hold it in front of you with your palms facing down.
3. Carefully lift the pole up and behind your head.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Chest Push from 3 point stance',
  'chest - plyometrics',
  '1. Begin in a three point stance, squatted down with your back flat and one hand on the ground. Place the medicine ball directly in front of you.
2. To begin, take your first step as you pull the ball to your chest, positioning both hands to prepare for the throw.
3. As you execute the second step, explosively release the ball forward as hard as possible.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Chest Push (multiple response)',
  'chest - plyometrics',
  '1. Begin in a kneeling position facing a wall or utilize a partner. Hold the ball with both hands tight into the chest.
2. Execute the pass by exploding forward and outward with the hips while pushing the ball as hard as possible.
3. Follow through by falling forward, catching yourself with your hands.
4. Immediately return to an upright position. Repeat for the desired number of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Chest Push (single response)',
  'chest - plyometrics',
  '1. Begin in a kneeling position holding the medicine ball with both hands tightly into the chest.
2. Execute the pass by exploding forward and outward with the hips while pushing the ball as far as possible.
3. Follow through by falling forward, catching yourself with your hands.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Chest Push with Run Release',
  'chest - plyometrics',
  '1. Begin in an athletic stance with the knees bent, hips back, and back flat. Hold the medicine ball near your legs. This will be your starting position.
2. While taking your first step draw the medicine ball into your chest.
3. As you take the second step, explosively push the ball forward, immediately sprinting for 10 yards after the release. If you are really fast, you can catch your own pass!',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Chest Stretch on Stability Ball',
  'chest - stretching',
  '1. Get on your hands and knees next to an exercise ball.
2. Place your elbows on top of the ball, keeping your arm out to your side. This will be your starting position.
3. Lower your torso towards the floor, keeping your elbow on top of the ball. Hold the stretch for 20-30 seconds, and repeat with the other arm.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Child''s Pose',
  'lower back - stretching',
  '1. Get on your hands and knees, walk your hands in front of you.
2. Lower your buttocks down to sit on your heels. Let your arms drag along the floor as you sit back to stretch your entire spine.
3. Once you settle onto your heels, bring your hands next to your feet and relax. "breathe" into your back. Rest your forehead on the floor. Avoid this position if you have knee problems.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Barra Fixa Supinada',
  'lats - strength',
  '1. Grab the pull-up bar with the palms facing your torso and a grip closer than the shoulder width.
2. As you have both arms extended in front of you holding the bar at the chosen grip width, keep your torso as straight as possible while creating a curvature on your lower back and sticking your chest out. This is your starting position. Tip: Keeping the torso as straight as possible maximizes biceps stimulation while minimizing back involvement.
3. As you breathe out, pull your torso up until your head is around the level of the pull-up bar. Concentrate on using the biceps muscles in order to perform the movement. Keep the elbows close to your body. Tip: The upper torso should remain stationary as it moves through space and only the arms should move. The forearms should do no other work other than hold the bar.
4. After a second of squeezing the biceps in the contracted position, slowly lower your torso back to the starting position; when your arms are fully extended. Breathe in as you perform this portion of the movement.
5. Repeat this motion for the prescribed amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Chin To Chest Stretch',
  'neck - stretching',
  '1. Get into a seated position on the floor.
2. Place both hands at the rear of your head, fingers interlocked, thumbs pointing down and elbows pointing straight ahead. Slowly pull your head down to your chest. Hold for 20-30 seconds.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Trapézio' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Circus Bell',
  'shoulders - strongman',
  '1. The circus bell is an oversized dumbbell with a thick handle. Begin with the dumbbell between your feet, and grip the handle with both hands.
2. Clean the dumbbell by extending through your hips and knees to deliver the implement to the desired shoulder, letting go with the extra hand.
3. Ensure that you get one of the dumbbell heads behind the shoulder to keep from being thrown off balance. To raise it overhead, dip by flexing the knees, and the drive upwards as you extend the dumbbell overhead, leaning slightly away from it as you do so.
4. Carefully guide the bell back to the floor, keeping it under control as much as possible. It is best to perform this event on a thick rubber mat to prevent damage to the floor.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Clean',
  'hamstrings - olympic weightlifting',
  '1. With a barbell on the floor close to the shins, take an overhand (or hook) grip just outside the legs. Lower your hips with the weight focused on the heels, back straight, head facing forward, chest up, with your shoulders just in front of the bar. This will be your starting position.
2. 
3. Begin the first pull by driving through the heels, extending your knees. Your back angle should stay the same, and your arms should remain straight. Move the weight with control as you continue to above the knees.
4. Next comes the second pull, the main source of acceleration for the clean. As the bar approaches the mid-thigh position, begin extending through the hips. In a jumping motion, accelerate by extending the hips, knees, and ankles, using speed to move the bar upward. There should be no need to actively pull through the arms to accelerate the weight; at the end of the second pull, the body should be fully extended, leaning slightly back, with the arms still extended.
5. As full extension is achieved, transition into the third pull by aggressively shrugging and flexing the arms with the elbows up and out. At peak extension, aggressively pull yourself down, rotating your elbows under the bar as you do so. Receive the bar in a front squat position, the depth of which is dependent upon the height of the bar at the end of the third pull. The bar should be racked onto the protracted shoulders, lightly touching the throat with the hands relaxed. Continue to descend to the bottom squat position, which will help in the recovery.
6. Immediately recover by driving through the heels, keeping the torso upright and elbows up. Continue until you have risen to a standing position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Clean Deadlift',
  'hamstrings - olympic weightlifting',
  '1. Begin standing with a barbell close to your shins. Your feet should be directly under your hips with your feet turned out slightly. Grip the bar with a double overhand grip or hook grip, about shoulder width apart. Squat down to the bar. Your spine should be in full extension, with a back angle that places your shoulders in front of the bar and your back as vertical as possible.
2. Begin by driving through the floor through the front of your heels. As the bar travels upward, maintain a constant back angle. Flare your knees out to the side to help keep them out of the bar''s path.
3. After the bar crosses the knees, complete the lift by driving the hips into the bar until your hips and knees are extended.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Clean Pull',
  'quadriceps - olympic weightlifting',
  '1. With a barbell on the floor close to the shins, take an overhand or hook grip just outside the legs. Lower your hips with the weight focused on the heels, back straight, head facing forward, chest up, with your shoulders just in front of the bar. This will be your starting position.
2. Begin the first pull by driving through the heels, extending your knees. Your back angle should stay the same, and your arms should remain straight and elbows out. Move the weight with control as you continue to above the knees.
3. Next comes the second pull, the main source of acceleration for the clean. As the bar approaches the mid-thigh position, begin extending through the hips. In a jumping motion, accelerate by extending the hips, knees, and ankles, using speed to move the bar upward. There should be no need to actively pull through the arms to accelerate the weight; at the end of the second pull, the body should be fully extended, leaning slightly back, with the arms still extended. Full extension should be violent and abrupt, and ensure that you do not prolong the extension for longer than necessary.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Clean Shrug',
  'traps - olympic weightlifting',
  '1. Begin with a shoulder width, double overhand or hook grip, with the bar hanging at the mid thigh position. Your back should be straight and inclined slightly forward.
2. Shrug your shoulders towards your ears. While this exercise can usually by loaded with heavier weight than a clean, avoid overloading to the point that the execution slows down.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Trapézio' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Arremesso (Clean & Jerk)',
  'shoulders - olympic weightlifting',
  '1. With a barbell on the floor close to the shins, take an overhand or hook grip just outside the legs. Lower your hips with the weight focused on the heels, back straight, head facing forward, chest up, with your shoulders just in front of the bar. This will be your starting position.
2. Begin the first pull by driving through the heels, extending your knees. Your back angle should stay the same, and your arms should remain straight. Move the weight with control as you continue to above the knees.
3. Next comes the second pull, the main source of acceleration for the clean. As the bar approaches the mid-thigh position, begin extending through the hips. In a jumping motion, accelerate by extending the hips, knees, and ankles, using speed to move the bar upward. There should be no need to actively pull through the arms to accelerate the weight; at the end of the second pull, the body should be fully extended, leaning slightly back, with the arms still extended.
4. As full extension is achieved, transition into the third pull by aggressively shrugging and flexing the arms with the elbows up and out. At peak extension, aggressively pull yourself down, rotating your elbows under the bar as you do so. Receive the bar in a front squat position, the depth of which is dependent upon the height of the bar at the end of the third pull. The bar should be racked onto the protracted shoulders, lightly touching the throat with the hands relaxed. Continue to descend to the bottom squat position, which will help in the recovery.
5. Immediately recover by driving through the heels, keeping the torso upright and elbows up. Continue until you have risen to a standing position.
6. The second phase is the jerk, which raises the weight overhead. Standing with the weight racked on the front of the shoulders, begin with the dip. With your feet directly under your hips, flex the knees without moving the hips backward. Go down only slightly, and reverse direction as powerfully as possible.
7. Drive through the heels create as much speed and force as possible, and be sure to move your head out of the way as the bar leaves the shoulders.
8. At this moment as the feet leave the floor, the feet must be placed into the receiving position as quickly as possible. In the brief moment the feet are not actively driving against the platform, the athletes effort to push the bar up will drive them down. The feet should be split, with one foot forward, and one foot back. Receive the bar with the arms locked out overhead. Return to a standing position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Clean and Press',
  'shoulders - strength',
  '1. Assume a shoulder-width stance, with knees inside the arms. Now while keeping the back flat, bend at the knees and hips so that you can grab the bar with the arms fully extended and a pronated grip that is slightly wider than shoulder width. Point the elbows out to sides. The bar should be close to the shins. Position the shoulders over or slightly ahead of the bar. Establish a flat back posture. This will be your starting position.
2. Begin to pull the bar by extending the knees. Move your hips forward and raise the shoulders at the same rate while keeping the angle of the back constant; continue to lift the bar straight up while keeping it close to your body.
3. As the bar passes the knee, extend at the ankles, knees, and hips forcefully, similar to a jumping motion. As you do so, continue to guide the bar with your hands, shrugging your shoulders and using the momentum from your movement to pull the bar as high as possible. The bar should travel close to your body, and you should keep your elbows out.
4. At maximum elevation, your feet should clear the floor and you should start to pull yourself under the bar. The mechanics of this could change slightly, depending on the weight used. You should descend into a squatting position as you pull yourself under the bar.
5. As the bar hits terminal height, rotate your elbows around and under the bar. Rack the bar across the front of the shoulders while keeping the torso erect and flexing the hips and knees to absorb the weight of the bar.
6. Stand to full height, holding the bar in the clean position.
7. Without moving your feet, press the bar overhead as you exhale. Lower the bar under control .',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Clean from Blocks',
  'quadriceps - olympic weightlifting',
  '1. With a barbell on boxes or stands of the desired height, take an overhand or hook grip just outside the legs. Lower your hips with the weight focused on the heels, back straight, head facing forward, chest up, with your shoulders just in front of the bar. This will be your starting position.
2. Begin the first pull by driving through the heels, extending your knees. Your back angle should stay the same, and your arms should remain straight with the elbows pointed out.
3. As full extension is achieved, transition into the receiving position by aggressively shrugging and flexing the arms with the elbows up and out. Aggressively pull yourself down, rotating your elbows under the bar as you do so. Receive the bar in a front squat position, the depth of which is dependent upon the height of the bar at the end of the third pull. The bar should be racked onto the protracted shoulders, lightly touching the throat with the hands relaxed. Continue to descend to the bottom squat position, which will help in the recovery.
4. Immediately recover by driving through the heels, keeping the torso upright and elbows up. Continue until you have risen to a standing position. Return the weight to the boxes for the next rep.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Clock Push-Up',
  'chest - strength',
  '1. Move into a prone position on the floor, supporting your weight on your hands and toes.
2. Your arms should be fully extended with the hands around shoulder width. Keep your body straight throughout the movement. This will be your starting position.
3. Descend by flexing at the elbow, lowering your chest toward the ground.
4. At the bottom, reverse the motion by pushing yourself up through elbow extension as quickly as possible until you are air borne. Aim to "jump" 12-18 inches to one side.
5. As you accelerate up, move your outside foot away from your direction of travel. Leaving the ground, shift your body about 30 degrees for the next repetition.
6. Return to the starting position and repeat the exercise, working all the way around until you are back where you started.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Close-Grip Barbell Bench Press',
  'triceps - strength',
  '1. Lie back on a flat bench. Using a close grip (around shoulder width), lift the bar from the rack and hold it straight over you with your arms locked. This will be your starting position.
2. As you breathe in, come down slowly until you feel the bar on your middle chest. Tip: Make sure that - as opposed to a regular bench press - you keep the elbows close to the torso at all times in order to maximize triceps involvement.
3. After a second pause, bring the bar back to the starting position as you breathe out and push the bar using your triceps muscles. Lock your arms in the contracted position, hold for a second and then start coming down slowly again. Tip: It should take at least twice as long to go down than to come up.
4. Repeat the movement for the prescribed amount of repetitions.
5. When you are done, place the bar back in the rack.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Close-Grip Dumbbell Press',
  'triceps - strength',
  '1. Place a dumbbell standing up on a flat bench.
2. Ensuring that the dumbbell stays securely placed at the top of the bench, lie perpendicular to the bench with only your shoulders lying on the surface. Hips should be below the bench and your legs bent with your feet firmly on the floor.
3. Grasp the dumbbell with both hands and hold it straight over your chest at arm''s length. Both palms should be pressing against the underside of the sides of the dumbbell. This will be your starting position.
4. Initiate the movement by lowering the dumbbell to your chest.
5. Return to the starting position by extending the elbows.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Close-Grip EZ-Bar Curl with Band',
  'biceps - strength',
  '1. Attach a band to each end of the bar. Take the bar, placing a foot on the middle of the band. Stand upright with a narrow, supinated grip on the EZ bar. The elbows should be close to the torso. This will be your starting position.
2. While keeping the upper arms in place, flex the elbows to execute the curl. Exhale as the weight is lifted.
3. Continue the movement until your biceps are fully contracted and the bar is at shoulder level. Hold the contracted position for a second and squeeze the biceps hard.
4. Slowly begin to bring the bar back to starting position as your breathe in.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Close-Grip EZ-Bar Press',
  'triceps - strength',
  '1. Lie on a flat bench with an EZ bar loaded to an appropriate weight.
2. Using a narrow grip lift the bar and hold it straight over your torso with your elbows in. The arms should be perpendicular to the floor. This will be your starting position.
3. Now lower the bar down to your lower chest as you breathe in. Keep the elbows in as you perform this movement.
4. Using the triceps to push the bar back up, press it back to the starting position by extending the elbows as you exhale.
5. Repeat.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Close-Grip EZ Bar Curl',
  'biceps - strength',
  '1. Stand up with your torso upright while holding an E-Z Curl Bar at the closer inner handle. The palm of your hands should be facing forward and they should be slightly tilted inwards due to the shape of the bar. The elbows should be close to the torso. This will be your starting position.
2. While holding the upper arms stationary, curl the weights forward while contracting the biceps as you breathe out. Tip: Only the forearms should move.
3. Continue the movement until your biceps are fully contracted and the bar is at shoulder level. Hold the contracted position for a second and squeeze the biceps hard.
4. Slowly begin to bring the bar back to starting position as your breathe in.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Close-Grip Front Lat Pulldown',
  'lats - strength',
  '1. Sit down on a pull-down machine with a wide bar attached to the top pulley. Make sure that you adjust the knee pad of the machine to fit your height. These pads will prevent your body from being raised by the resistance attached to the bar.
2. Grab the bar with the palms facing forward using the prescribed grip. Note on grips: For a wide grip, your hands need to be spaced out at a distance wider than your shoulder width. For a medium grip, your hands need to be spaced out at a distance equal to your shoulder width and for a close grip at a distance smaller than your shoulder width.
3. As you have both arms extended in front of you - while holding the bar at the chosen grip width - bring your torso back around 30 degrees or so while creating a curvature on your lower back and sticking your chest out. This is your starting position.
4. As you breathe out, bring the bar down until it touches your upper chest by drawing the shoulders and the upper arms down and back. Tip: Concentrate on squeezing the back muscles once you reach the full contracted position. The upper torso should remain stationary (only the arms should move). The forearms should do no other work except for holding the bar; therefore do not try to pull the bar down using the forearms.
5. After a second in the contracted position, while squeezing your shoulder blades together, slowly raise the bar back to the starting position when your arms are fully extended and the lats are fully stretched. Inhale during this portion of the movement.
6. 6. Repeat this motion for the prescribed amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Close-Grip Push-Up off of a Dumbbell',
  'triceps - strength',
  '1. Lie on the floor and place your hands on an upright dumbbell. Supporting your weight on your toes and hands, keep your torso rigid and your elbows in with your arms straight. This will be your starting position.
2. Lower your body, allowing the elbows to flex while you inhale. Keep your body straight, not allowing your hips to rise or sag.
3. Press yourself back up to the starting position by extending the elbows. Breathe out as you perform this step.
4. After a pause at the contracted position, repeat the movement for the prescribed amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Close-Grip Standing Barbell Curl',
  'biceps - strength',
  '1. Hold a barbell with both hands, palms up and a few inches apart.
2. Stand with your torso straight and your head up. Your feet should be about shoulder width and your elbows close to your torso. This will be your starting position. Tip: You will keep your upper arms and elbows stationary throughout the movement.
3. Curl the bar up in a semicircular motion until the forearms touch your biceps. Exhale as you perform this portion of the movement and contract your biceps hard for a second at the top. Tip: Avoid bending the back or using swinging motions as you lift the weight. Only the forearms should move.
4. Slowly go back down to the starting position as you inhale.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cocoons',
  'abdominals - strength',
  '1. Begin by lying on your back on the ground. Your legs should be straight and your arms extended behind your head. This will be your starting position.
2. To perform the movement, tuck the knees toward your chest, rotating your pelvis to lift your glutes from the floor. As you do so, flex the spine, bringing your arms back over your head to perform a simultaneous crunch motion.
3. After a brief pause, return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Conan''s Wheel',
  'quadriceps - strongman',
  '1. With the weight loaded, take a zurcher hold on the end of the implement. Place the bar in the crook of the elbow and hold onto your wrist. Try to keep the weight off of the forearms.
2. Begin by lifting the weight from the ground. Keep a tight, upright posture as you being to walk, taking short, fast steps. Look up and away as you turn in a circle. Do not hold your breath during the event. Continue walking until you complete one or more complete turns.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Concentration Curls',
  'biceps - strength',
  '1. Sit down on a flat bench with one dumbbell in front of you between your legs. Your legs should be spread with your knees bent and feet on the floor.
2. Use your right arm to pick the dumbbell up. Place the back of your right upper arm on the top of your inner right thigh. Rotate the palm of your hand until it is facing forward away from your thigh. Tip: Your arm should be extended and the dumbbell should be above the floor. This will be your starting position.
3. While holding the upper arm stationary, curl the weights forward while contracting the biceps as you breathe out. Only the forearms should move. Continue the movement until your biceps are fully contracted and the dumbbells are at shoulder level. Tip: At the top of the movement make sure that the little finger of your arm is higher than your thumb. This guarantees a good contraction. Hold the contracted position for a second as you squeeze the biceps.
4. Slowly begin to bring the dumbbells back to starting position as your breathe in. Caution: Avoid swinging motions at any time.
5. Repeat for the recommended amount of repetitions. Then repeat the movement with the left arm.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cross-Body Crunch',
  'abdominals - strength',
  '1. Lie flat on your back and bend your knees about 60 degrees.
2. Keep your feet flat on the floor and place your hands loosely behind your head. This will be your starting position.
3. Now curl up and bring your right elbow and shoulder across your body while bring your left knee in toward your left shoulder at the same time. Reach with your elbow and try to touch your knee. Exhale as you perform this movement. Tip: Try to bring your shoulder up towards your knee rather than just your elbow and remember that the key is to contract the abs as you perform the movement; not just to move the elbow.
4. Now go back down to the starting position as you inhale and repeat with the left elbow and the right knee.
5. Continue alternating in this manner until all prescribed repetitions are done.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cross Body Hammer Curl',
  'biceps - strength',
  '1. Stand up straight with a dumbbell in each hand. Your hands should be down at your side with your palms facing in.
2. While keeping your palms facing in and without twisting your arm, curl the dumbbell of the right arm up towards your left shoulder as you exhale. Touch the top of the dumbbell to your shoulder and hold the contraction for a second.
3. Slowly lower the dumbbell along the same path as you inhale and then repeat the same movement for the left arm.
4. Continue alternating in this fashion until the recommended amount of repetitions is performed for each arm.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cross Over - With Bands',
  'chest - strength',
  '1. Secure an exercise band around a stationary post.
2. While facing away from the post, grab the handles on both ends of the band and step forward enough to create tension on the band.
3. Raise your arms to the sides, parallel to the floor, perpendicular to your torso (your torso and the arms should resemble the letter "T") and with the palms facing forward. Have them extended with a slight bend at the elbows. This will be your starting position.
4. While keeping your arms straight, bring them across your chest in a semicircular motion to the front as you exhale and flex your pecs. Hold the contraction for a second.
5. Slowly return to the starting position as you inhale.
6. Perform for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Elástico/Banda' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Crossover Reverse Lunge',
  'lower back - stretching',
  '1. Stand with your feet shoulder width apart. This will be your starting position.
2. Perform a rear lunge by stepping back with one foot and flexing the hips and front knee. As you do so, rotate your torso across the front leg.
3. After a brief pause, return to the starting position and repeat on the other side, continuing in an alternating fashion.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Crucifix',
  'shoulders - strongman',
  '1. In the crucifix, you statically hold weights out to the side for time. While the event can be practiced using dumbbells, it is best to practice with one of the various implements used, such as axes and hammers, as it feels different.
2. Begin standing, and raise your arms out to the side holding the implements. Your arms should be parallel to the ground. In competition, judges or sensors are used to let you know when you break parallel. Hold for as long as you can. Typically, the weights should be heavy enough that you fail in 30-60 seconds.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Crunch - Hands Overhead',
  'abdominals - strength',
  '1. Lie on the floor with your back flat and knees bent with around a 60-degree angle between the hamstrings and the calves.
2. Keep your feet flat on the floor and stretch your arms overhead with your palms crossed. This will be your starting position.
3. Curl your upper body forward and bring your shoulder blades just off the floor. At all times, keep your arms aligned with your head, neck and shoulder. Don''t move them forward from that position. Exhale as you perform this portion of the movement and hold the contraction for a second.
4. Slowly lower down to the starting position as you inhale.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Crunch - Legs On Exercise Ball',
  'abdominals - strength',
  '1. Lie flat on your back with your feet resting on an exercise ball and your knees bent at a 90 degree angle.
2. Place your feet three to four inches apart and point your toes inward so they touch.
3. Place your hands lightly on either side of your head keeping your elbows in. Tip: Don''t lock your fingers behind your head.
4. Push the small of your back down in the floor in order to better isolate your abdominal muscles. This will be your starting position.
5. Begin to roll your shoulders off the floor and continue to push down as hard as you can with your lower back. Your shoulders should come up off the floor only about four inches, and your lower back should remain on the floor. Breathe out as you execute this portion of the movement. Squeeze your abdominals hard at the top of the contraction and hold for a second. Tip: Focus on a slow, controlled movement. Refrain from using momentum at any time.
6. Slowly go back down to the starting position as you inhale.
7. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Crunches',
  'abdominals - strength',
  '1. Lie flat on your back with your feet flat on the ground, or resting on a bench with your knees bent at a 90 degree angle. If you are resting your feet on a bench, place them three to four inches apart and point your toes inward so they touch.
2. Now place your hands lightly on either side of your head keeping your elbows in. Tip: Don''t lock your fingers behind your head.
3. While pushing the small of your back down in the floor to better isolate your abdominal muscles, begin to roll your shoulders off the floor.
4. Continue to push down as hard as you can with your lower back as you contract your abdominals and exhale. Your shoulders should come up off the floor only about four inches, and your lower back should remain on the floor. At the top of the movement, contract your abdominals hard and keep the contraction for a second. Tip: Focus on slow, controlled movement - don''t cheat yourself by using momentum.
5. After the one second contraction, begin to come down slowly again to the starting position as you inhale.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Cuban Press',
  'shoulders - strength',
  '1. Take a dumbbell in each hand with a pronated grip in a standing position. Raise your upper arms so that they are parallel to the floor, allowing your lower arms to hang in the "scarecrow" position. This will be your starting position.
2. To initiate the movement, externally rotate the shoulders to move the upper arm 180 degrees. Keep the upper arms in place, rotating the upper arms until the wrists are directly above the elbows, the forearms perpendicular to the floor.
3. Now press the dumbbells by extending at the elbows, straightening your arms overhead.
4. Return to the starting position as you breathe in by reversing the steps.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dancer''s Stretch',
  'lower back - stretching',
  '1. Sit up on the floor.
2. Cross your right leg over your left, keeping the knee bent. Your left leg is straight and down on the floor.
3. Place your left arm on your right leg and your right hand on the floor.
4. Rotate your upper body to the right, and hold for 10-20 seconds. Switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dead Bug',
  'abdominals - strength',
  '1. Begin lying on your back with your hands extended above you toward the ceiling.
2. Bring your feet, knees, and hips up to 90 degrees.
3. Exhale hard to bring your ribcage down and flatten your back onto the floor, rotating your pelvis up and squeezing your glutes. Hold this position throughout the movement. This will be your starting position.
4. Initiate the exercise by extending one leg, straightening the knee and hip to bring the leg just above the ground.
5. Maintain the position of your lumbar and pelvis as you perform the movement, as your back is going to want to arch.
6. Stay tight and return the working leg to the starting position.
7. Repeat on the opposite side, alternating until the set is complete.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Deadlift with Bands',
  'lower back - powerlifting',
  '1. To deadlift with short bands, simply loop them over the bar before you start, and step into them to set up. For long bands, they will need to be anchored to a secure base, such as heavy dumbbells or a rack.
2. With your feet, and your grip set, take a big breath and then lower your hips and bend the knees until your shins contact the bar. Look forward with your head, keep your chest up and your back arched, and begin driving through the heels to move the weight upward. After the bar passes the knees, aggressively pull the bar back, pulling your shoulder blades together as you drive your hips forward into the bar.
3. Lower the bar by bending at the hips and guiding it to the floor.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Deadlift with Chains',
  'lower back - powerlifting',
  '1. You can attach the chains to the sleeves of the bar, or just drape the middle over the bar so there is a greater weight increase as you lift.
2. Approach the bar so that it is centered over your feet. You feet should be about hip width apart. Bend at the hip to grip the bar at shoulder width, allowing your shoulder blades to protract. Typically, you would use an overhand grip or an over/under grip on heavier sets. With your feet, and your grip set, take a big breath and then lower your hips and bend the knees until your shins contact the bar.
3. Look forward with your head, keep your chest up and your back arched, and begin driving through the heels to move the weight upward. After the bar passes the knees, aggressively pull the bar back, pulling your shoulder blades together as you drive your hips forward into the bar.
4. Lower the bar by bending at the hips and guiding it to the floor.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Decline Barbell Bench Press',
  'chest - strength',
  '1. Secure your legs at the end of the decline bench and slowly lay down on the bench.
2. Using a medium width grip (a grip that creates a 90-degree angle in the middle of the movement between the forearms and the upper arms), lift the bar from the rack and hold it straight over you with your arms locked. The arms should be perpendicular to the floor. This will be your starting position. Tip: In order to protect your rotator cuff, it is best if you have a spotter help you lift the barbell off the rack.
3. As you breathe in, come down slowly until you feel the bar on your lower chest.
4. After a second pause, bring the bar back to the starting position as you breathe out and push the bar using your chest muscles. Lock your arms and squeeze your chest in the contracted position, hold for a second and then start coming down slowly again. Tip: It should take at least twice as long to go down than to come up).
5. Repeat the movement for the prescribed amount of repetitions.
6. When you are done, place the bar back in the rack.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Decline Close-Grip Bench To Skull Crusher',
  'triceps - strength',
  '1. Secure your legs at the end of the decline bench and slowly lay down on the bench.
2. Using a close grip (a grip that is slightly less than shoulder width), lift the bar from the rack and hold it straight over you with your arms locked and elbows in. The arms should be perpendicular to the floor. This will be your starting position. Tip: In order to protect your rotator cuff, it is best if you have a spotter help you lift the barbell off the rack.
3. Now lower the bar down to your lower chest as you breathe in. Keep the elbows in as you perform this movement.
4. Using the triceps to push the bar back up, press it back to the starting position as you exhale.
5. As you breathe in and you keep the upper arms stationary, bring the bar down slowly by moving your forearms in a semicircular motion towards you until you feel the bar slightly touch your forehead. Breathe in as you perform this portion of the movement.
6. Lift the bar back to the starting position by contracting the triceps and exhaling.
7. Repeat steps 3-6 until the recommended amount of repetitions is performed.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Decline Crunch',
  'abdominals - strength',
  '1. Secure your legs at the end of the decline bench and lie down.
2. Now place your hands lightly on either side of your head keeping your elbows in. Tip: Don''t lock your fingers behind your head.
3. While pushing the small of your back down in the bench to better isolate your abdominal muscles, begin to roll your shoulders off it.
4. Continue to push down as hard as you can with your lower back as you contract your abdominals and exhale. Your shoulders should come up off the bench only about four inches, and your lower back should remain on the bench. At the top of the movement, contract your abdominals hard and keep the contraction for a second. Tip: Focus on slow, controlled movement - don''t cheat yourself by using momentum.
5. After the one second contraction, begin to come down slowly again to the starting position as you inhale.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Decline Dumbbell Bench Press',
  'chest - strength',
  '1. Secure your legs at the end of the decline bench and lie down with a dumbbell on each hand on top of your thighs. The palms of your hand will be facing each other.
2. Once you are laying down, move the dumbbells in front of you at shoulder width.
3. Once at shoulder width, rotate your wrists forward so that the palms of your hands are facing away from you. This will be your starting position.
4. Bring down the weights slowly to your side as you breathe out. Keep full control of the dumbbells at all times. Tip: Throughout the motion, the forearms should always be perpendicular to the floor.
5. As you breathe out, push the dumbbells up using your pectoral muscles. Lock your arms in the contracted position, squeeze your chest, hold for a second and then start coming down slowly. Tip: It should take at least twice as long to go down than to come up..
6. Repeat the movement for the prescribed amount of repetitions of your training program.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Decline Dumbbell Flyes',
  'chest - strength',
  '1. Secure your legs at the end of the decline bench and lie down with a dumbbell on each hand on top of your thighs. The palms of your hand will be facing each other.
2. Once you are laying down, move the dumbbells in front of you at shoulder width. The palms of the hands should be facing each other and the arms should be perpendicular to the floor and fully extended. This will be your starting position.
3. With a slight bend on your elbows in order to prevent stress at the biceps tendon, lower your arms out at both sides in a wide arc until you feel a stretch on your chest. Breathe in as you perform this portion of the movement. Tip: Keep in mind that throughout the movement, the arms should remain stationary; the movement should only occur at the shoulder joint.
4. Return your arms back to the starting position as you squeeze your chest muscles and breathe out. Tip: Make sure to use the same arc of motion used to lower the weights.
5. Hold for a second at the contracted position and repeat the movement for the prescribed amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Decline Dumbbell Triceps Extension',
  'triceps - strength',
  '1. Secure your legs at the end of the decline bench and lie down with a dumbbell on each hand on top of your thighs. The palms of your hand will be facing each other.
2. Once you are laying down, move the dumbbells in front of you at shoulder width. The palms of the hands should be facing each other and the arms should be perpendicular to the floor and fully extended. This will be your starting position.
3. As you breathe in and you keep the upper arms stationary (and elbows in), bring the dumbbells down slowly by moving your forearms in a semicircular motion towards you until your thumbs are next to your ears. Breathe in as you perform this portion of the movement.
4. Lift the dumbbells back to the starting position by contracting the triceps and exhaling.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Decline EZ Bar Triceps Extension',
  'triceps - strength',
  '1. Secure your legs at the end of the decline bench and slowly lay down on the bench.
2. Using a close grip (a grip that is slightly less than shoulder width), lift the EZ bar from the rack and hold it straight over you with your arms locked and elbows in. The arms should be perpendicular to the floor. This will be your starting position. Tip: In order to protect your rotator cuff, it is best if you have a spotter help you lift the barbell off the rack.
3. As you breathe in and you keep the upper arms stationary, bring the bar down slowly by moving your forearms in a semicircular motion towards you until you feel the bar slightly touch your forehead. Breathe in as you perform this portion of the movement.
4. Lift the bar back to the starting position by contracting the triceps and exhaling.
5. Repeat until the recommended amount of repetitions is performed.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Decline Oblique Crunch',
  'abdominals - strength',
  '1. Secure your legs at the end of the decline bench and slowly lay down on the bench.
2. Raise your upper body off the bench until your torso is about 35-45 degrees if measured from the floor.
3. Put one hand beside your head and the other on your thigh. This will be your starting position.
4. Raise your upper body slowly from the starting position while turning your torso to the left. Continue crunching up as you exhale until your right elbow touches your left knee. Hold this contracted position for a second. Tip: Focus on keeping your abs tight and keeping the movement slow and controlled.
5. Lower your body back down slowly to the starting position as you inhale.
6. After completing one set on the right for the recommended amount of repetitions, switch to your left side. Tip: Focus on really twisting your torso and feeling the contraction when you are in the up position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Decline Push-Up',
  'chest - strength',
  '1. Lie on the floor face down and place your hands about 36 inches apart while holding your torso up at arms length. Move your feet up to a box or bench. This will be your starting position.
2. Next, lower yourself downward until your chest almost touches the floor as you inhale.
3. Now breathe out and press your upper body back up to the starting position while squeezing your chest.
4. After a brief pause at the top contracted position, you can begin to lower yourself downward again for as many repetitions as needed.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Decline Reverse Crunch',
  'abdominals - strength',
  '1. Lie on your back on a decline bench and hold on to the top of the bench with both hands. Don''t let your body slip down from this position.
2. Hold your legs parallel to the floor using your abs to hold them there while keeping your knees and feet together. Tip: Your legs should be fully extended with a slight bend on the knee. This will be your starting position.
3. While exhaling, move your legs towards the torso as you roll your pelvis backwards and you raise your hips off the bench. At the end of this movement your knees will be touching your chest.
4. Hold the contraction for a second and move your legs back to the starting position while inhaling.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Decline Smith Press',
  'chest - strength',
  '1. Place a decline bench underneath the Smith machine. Now place the barbell at a height that you can reach when lying down and your arms are almost fully extended. Using a pronated grip that is wider than shoulder width, unlock the bar from the rack and hold it straight over you with your arms extended. This will be your starting position.
2. As you inhale, lower the bar under control by allowing the elbows to flex, lightly contacting the torso.
3. After a brief pause, bring the bar back to the starting position by extending the elbows, exhaling as you do so.
4. Repeat the movement for the prescribed amount of repetitions.
5. When the set is complete, lock the bar back in the rack.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Deficit Deadlift',
  'lower back - powerlifting',
  '1. Begin by having a platform or weight plates that you can stand on, usually 1-3 inches in height. Approach the bar so that it is centered over your feet. You feet should be about hip width apart. Bend at the hip to grip the bar at shoulder width, allowing your shoulder blades to protract. Typically, you would use an overhand grip or an over/under grip on heavier sets.
2. With your feet, and your grip set, take a big breath and then lower your hips and bend the knees until your shins contact the bar. Look forward with your head, keep your chest up and your back arched, and begin driving through the heels to move the weight upward. After the bar passes the knees, aggressively pull the bar back, pulling your shoulder blades together as you drive your hips forward into the bar.
3. Lower the bar by bending at the hips and guiding it to the floor.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Depth Jump Leap',
  'quadriceps - plyometrics',
  '1. For this drill you will need two boxes or benches, one 12 to 16 inches high and the other 22 to 26 inches high.
2. Stand on one of the two boxes with arms at the sides; feet should be together and slightly off the edge as in the depth jump. Place the other box approximately two or three feet in front of and facing the performer.
3. Begin by dropping off the initial box, landing and simultaneously taking off with both feet.
4. Rebound by driving upward and outward as intensely as possible, using the arms and full extension of the body to jump onto the higher box. Again, allow the legs to absorb the impact.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dip Machine',
  'triceps - strength',
  '1. Sit securely in a dip machine, select the weight and firmly grasp the handles.
2. Now keep your elbows in at your sides in order to place emphasis on the triceps. The elbows should be bent at a 90 degree angle.
3. As you contract the triceps, extend your arms downwards as you exhale. Tip: At the bottom of the movement, focus on keeping a little bend in your arms to keep tension on the triceps muscle.
4. Now slowly let your arms come back up to the starting position as you inhale.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dips - Chest Version',
  'chest - strength',
  '1. For this exercise you will need access to parallel bars. To get yourself into the starting position, hold your body at arms length (arms locked) above the bars.
2. While breathing in, lower yourself slowly with your torso leaning forward around 30 degrees or so and your elbows flared out slightly until you feel a slight stretch in the chest.
3. Once you feel the stretch, use your chest to bring your body back to the starting position as you breathe out. Tip: Remember to squeeze the chest at the top of the movement for a second.
4. Repeat the movement for the prescribed amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dips - Triceps Version',
  'triceps - strength',
  '1. To get into the starting position, hold your body at arm''s length with your arms nearly locked above the bars.
2. Now, inhale and slowly lower yourself downward. Your torso should remain upright and your elbows should stay close to your body. This helps to better focus on tricep involvement. Lower yourself until there is a 90 degree angle formed between the upper arm and forearm.
3. Then, exhale and push your torso back up using your triceps to bring your body back to the starting position.
4. Repeat the movement for the prescribed amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Donkey Calf Raises',
  'calves - strength',
  '1. For this exercise you will need access to a donkey calf raise machine. Start by positioning your lower back and hips under the padded lever provided. The tailbone area should be the one making contact with the pad.
2. Place both of your arms on the side handles and place the balls of your feet on the calf block with the heels extending off. Align the toes forward, inward or outward, depending on the area you wish to target, and straighten the knees without locking them. This will be your starting position.
3. Raise your heels as you breathe out by extending your ankles as high as possible and flexing your calf. Ensure that the knee is kept stationary at all times. There should be no bending at any time. Hold the contracted position by a second before you start to go back down.
4. Go back slowly to the starting position as you breathe in by lowering your heels as you bend the ankles until calves are stretched.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Panturrilha' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Double Kettlebell Alternating Hang Clean',
  'hamstrings - strength',
  '1. Place two kettlebells between your feet. To get in the starting position, push your butt back and look straight ahead.
2. Clean one kettlebell to your shoulder and hold on to the other kettlebell.
3. With a fluid motion, lower the top kettlebell while driving the bottom kettlebell up.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Double Kettlebell Jerk',
  'shoulders - strength',
  '1. Hold a kettlebell by the handle in each hand.
2. Clean the kettlebells to your shoulders by extending through the legs and hips as you pull the kettlebells towards your shoulders. Rotate your wrists as you do so, so that the palms face forward. This will be your starting position.
3. Dip your body by bending the knees, keeping your torso upright.
4. Immediately reverse direction, driving through the heels, in essence jumping to create momentum.
5. As you do so, press the kettlebells overhead to lockout by extending the arms, using your body''s momentum to move the weights.
6. Return your feet to the ground in a split fashion, with one foot forward and one foot back.
7. Keeping the weights overhead, return to a standing position, bringing your feet together. Lower the weights to perform the next repetition.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Double Kettlebell Push Press',
  'shoulders - strength',
  '1. Clean two kettlebells to your shoulders.
2. Squat down a few inches and reverse the motion rapidly. Use the momentum from the legs to drive the kettlebells overhead.
3. Once the kettlebells are locked out, lower the kettlebells to your shoulders and repeat.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Double Kettlebell Snatch',
  'shoulders - strength',
  '1. Place two kettlebells behind your feet. Bend your knees and sit back to pick up the kettlebells.
2. Swing the kettlebells between your legs forcefully and reverse the direction.
3. Drive through with your hips and lock the ketttlebells overhead in one uninterrupted motion.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Double Kettlebell Windmill',
  'abdominals - strength',
  '1. Place a kettlebell in front of your front foot and clean and press a kettlebell overhead with your opposite arm. Clean the kettlebell to your shoulder by extending through the legs and hips as you pull the kettlebell towards your shoulders. Rotate your wrist as you do so, so that the palm faces forward.
2. Keeping the kettlebell locked out at all times, push your butt out in the direction of the locked out kettlebell. Turn your feet out at a forty-five degree angle from the arm with the locked out kettlebell.
3. Bending at the hip to one side, sticking your butt out, slowly lean until you can retrieve the kettlebell from the floor. Keep your eyes on the kettlebell that you hold over your head at all times.
4. Pause for a second after retrieving the kettlebell from the ground and reverse the motion back to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Double Leg Butt Kick',
  'quadriceps - plyometrics',
  '1. Begin standing with your knees slightly bent.
2. Quickly squat a short distance, flexing the hips and knees, and immediately extend to jump for maximum vertical height.
3. As you go up, tuck your heels by flexing the knees, attempting to touch the buttocks.
4. Finish the motion by landing with the knees only partially bent, using your legs to absorb the impact.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Downward Facing Balance',
  'glutes - strength',
  '1. Lie facedown on top of an exercise ball.
2. While resting on your stomach on the ball, walk your hands forward along the floor and lift your legs, extending your elbows and knees.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Drag Curl',
  'biceps - strength',
  '1. Grab a barbell with a supinated grip (palms facing forward) and get your elbows close to your torso and back. This will be your starting position.
2. As you exhale, curl the bar up while keeping the elbows to the back as you "Drag" the bar up by keeping it in contact with your torso. Tip: As you can see, you will not be keeping the elbows pinned to your sides, but instead you will be bringing them back. Also, do not lift your shoulders.
3. Slowly go back to the starting position as you keep the bar in contact with the torso at all times.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Drop Push',
  'chest - plyometrics',
  '1. Position low boxes or other platforms 2-3 feet apart.
2. Move to a pushup position between them, supporting yourself by placing your hands on the boxes.
3. With good posture, drop from the platforms by pressing up and moving your hands to shoulder width, cushioning your landing by absorbing the impact through the arm.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'calisthenics',
  TRUE,
  TRUE
);
