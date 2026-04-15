-- =============================================================================
-- ACADEMIA APP - PARTE 8/12: Exercícios 661-873 de 873
-- =============================================================================
-- Cole no SQL Editor do Supabase e clique em RUN.
-- Idempotente (use IF NOT EXISTS / ON CONFLICT).
-- =============================================================================

INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Side-Lying Floor Stretch',
  'lats - stretching',
  '1. First lie on your left side, bending your left knee in front of you to stabilize your torso (use your abdominal muscles as well to hold you upright).
2. Straighten your right leg and rest the right foot on the floor behind your left. Straighten your right arm over your head and gently pull on your right wrist to stretch the entire right side of the body. Switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Side Bridge',
  'abdominals - strength',
  '',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Side Hop-Sprint',
  'quadriceps - plyometrics',
  '1. Stand to the side of a cone or hurdle.
2. Begin this drill by hopping sideways over the obstacle, rebounding out of your landing to hop back to where you started.
3. Hop for a prescribed number or repetitions as quickly as possible, and finish this drill by sprinting a short distance upon landing the last hop.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Side Jackknife',
  'abdominals - strength',
  '',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Side Lateral Raise',
  'shoulders - strength',
  '1. Pick a couple of dumbbells and stand with a straight torso and the dumbbells by your side at arms length with the palms of the hand facing you. This will be your starting position.
2. While maintaining the torso in a stationary position (no swinging), lift the dumbbells to your side with a slight bend on the elbow and the hands slightly tilted forward as if pouring water in a glass. Continue to go up until you arms are parallel to the floor. Exhale as you execute this movement and pause for a second at the top.
3. Lower the dumbbells back down slowly to the starting position as you inhale.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Side Laterals to Front Raise',
  'shoulders - strength',
  '1. In a standing position, hold a pair of dumbbells at your side. This will be your starting position.
2. Keeping your elbows slightly bent, raise the weights directly in front of you to shoulder height, avoiding any swinging or cheating.
3. At the top of the exercise move the weights out in front of you, keeping your arms extended.
4. Lower the weights with a controlled motion.
5. On the next repetition, raise the weights in front of you to shoulder height before moving the weights laterally to your sides.
6. Lower the weights to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Side Leg Raises',
  'adductors - stretching',
  '1. Stand next to a chair, which you may hold onto as a support. Stand on one leg. This will be your starting position.
2. Keeping your leg straight, raise it as far out to the side as possible, and swing it back down, allowing it to cross the opposite leg.
3. Repeat this swinging motion 5-10 times, increasing the range of motion as you do so.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Side Lying Groin Stretch',
  'adductors - stretching',
  '1. Start off by lying on your right side and bend your right knee in front of you to stabilize the torso.
2. Rest your head on your right hand or shoulder. Lift your left leg upward and hold it by the back of the knee (easier) or the foot (harder).
3. Pull your left knee in toward your left shoulder and simultaneously press your foot or knee down to the floor. To intensify this stretch, straighten your left leg. Switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Side Neck Stretch',
  'neck - stretching',
  '1. Start with your shoulders relaxed, gently tilt your head towards your shoulder.
2. Assist stretch with a gentle pull on the side of the head.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Trapézio' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Side Standing Long Jump',
  'quadriceps - plyometrics',
  '1. Begin standing with your feet hip width apart in an athletic stance. Your head and chest should be up, knees and hips slightly bent. This will be your starting position.
2. Leaning to your right, extend through your hips, knees, and ankles to jump into the air. Block with the arms to lead the movement, jumping as far to your right as you can.
3. Land facing the same direction with your feet hip width apart, absorbing the impact through your lower body.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Side To Side Chins',
  'lats - strength',
  '1. Grab the pull-up bar with the palms facing forward using a wide grip.
2. As you have both arms extended in front of you holding the bar at a wide grip, bring your torso back around 30 degrees or so while creating a curvature on your lower back and sticking your chest out. This is your starting position.
3. Pull your torso up while leaning to the left hand side until the bar almost touches your upper chest by drawing the shoulders and the upper arms down and back. Exhale as you perform this portion of the movement. Tip: Concentrate on squeezing the back muscles once you reach the full contracted position. The upper torso should remain stationary as it moves through space (no swinging) and only the arms should move. The forearms should do no other work other than hold the bar.
4. After a second of contraction, inhale as you go back to the starting position.
5. Now, pull your torso up while leaning to the right hand side until the bar almost touches your upper chest by drawing the shoulders and the upper arms down and back. Exhale as you perform this portion of the movement. Tip: Concentrate on squeezing the back muscles once you reach the full contracted position. The upper torso should remain stationary as it moves through space and only the arms should move. The forearms should do no other work other than hold the bar.
6. After a second of contraction, inhale as you go back to the starting position.
7. Repeat steps 3-6 until you have performed the prescribed amount of repetitions for each side.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Side Wrist Pull',
  'shoulders - stretching',
  '1. This stretch works best standing. Cross your left arm over the midline of your body and hold the left wrist in your right hand down at the level of your hips. Start the stretch with a bent left arm.
2. Slowly straighten, pull, and lift it up to shoulder height, as pictured. Feel this stretch originate in your back, not your shoulders, and don''t pull too hard on the shoulders joint. Switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Side to Side Box Shuffle',
  'quadriceps - plyometrics',
  '1. Stand to one side of the box with your left foot resting on the middle of it.
2. To begin, jump up and over to the other side of the box, landing with your right foot on top of the box and your left foot on the floor. Swing your arms to aid your movement.
3. Continue shuffling back and forth across the box.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Single-Arm Cable Crossover',
  'chest - strength',
  '1. Begin by moving the pulleys to the high position, select the resistance to be used, and take a handle in each hand.
2. Step forward in front of both pulleys with your arms extended in front of you, bringing your hands together. Your head and chest should be up as you lean forward, while your feet should be staggered. This will be your starting position.
3. Keeping your left arm in place, allow your right arm to extend out to the side, maintaining a slight bend at the elbow. The right arm should be perpendicular to the body at approximately shoulder level.
4. Return your arm back to the starting position by pulling your hand back to the midline of the body.
5. Hold for a second at the starting position and repeat the movement on the opposite side. Continue alternating back and forth for the prescribed number of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Single-Arm Linear Jammer',
  'shoulders - strength',
  '1. Position a bar into a landmine or securely anchor it in a corner. Load the bar to an appropriate weight.
2. Raise the bar from the floor, taking it to your shoulders with one or both hands. Adopt a wide stance. This will be your starting position.
3. Perform the movement by extending the elbow, pressing the weight up. Move explosively, extending the hips and knees fully to produce maximal force.
4. Return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Single-Arm Push-Up',
  'chest - strength',
  '1. Begin laying prone on the ground. Move yourself into a position supporting your weight on your toes and one arm. Your working arm should be placed directly under the shoulder, fully extended. Your legs should be extended, and for this movement you may need a wider base, placing your feet further apart than in a normal push-up.
2. Maintain good posture, and place your free hand behind your back. This will be your starting position.
3. Lower yourself by allowing the elbow to flex until you touch the ground.
4. Descend slowly, and reverse direction be extending the arm to return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Single-Cone Sprint Drill',
  'quadriceps - plyometrics',
  '1. This drill teaches quick foot action. You need a single cone. Begin standing next to the cone with one arm back and one arm forward.
2. Chop the feet as quickly as possible, blocking with the arms. Circle the cone, keep your knees up, with violent foot action.
3. Rest after three trips around the cone.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Single-Leg High Box Squat',
  'quadriceps - strength',
  '1. Position a box in a rack. Secure a band or rope in place above the box.
2. Standing in front of it, step onto the box to a full standing position, letting your other leg remain unsupported. Hold onto the band for balance
3. . Continue stepping up and down on the same leg before switching to the opposite side.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Single-Leg Hop Progression',
  'quadriceps - plyometrics',
  '1. Arrange a line of cones in front of you. Assume a relaxed standing position, balanced on one leg. Raise the knee of your opposite leg. This will be your starting position.
2. Hop forward, jumping and landing with the same leg over the cone.
3. Use a countermovement jump to hop from cone to cone.
4. At the end, turn around and go back on the other leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Single-Leg Lateral Hop',
  'quadriceps - plyometrics',
  '1. Stand to the side of a cone or hurdle. To get into the start position, stand on one leg with your knee slightly bent.
2. To begin, execute a counterjump to hop sideways over the cone.
3. Land on your jumping leg, and immediately rebound out of it by jumping back to the start position.
4. Continue hopping back and forth.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Single-Leg Leg Extension',
  'quadriceps - strength',
  '1. Seat yourself in the machine and adjust it so that you are positioned properly. The pad should be against the lower part of the shin but not in contact with the ankle. Adjust the seat so that the pivot point is in line with your knee. Select a weight appropriate for your abilities.
2. Maintaining good posture, fully extend one leg, pausing at the top of the motion.
3. Return to the starting position without letting the weight stop, keeping tension on the muscle.
4. Repeat for the desired number of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Single-Leg Stride Jump',
  'quadriceps - plyometrics',
  '1. Stand to the side of a box with your inside foot on top of it, close to the edge.
2. Begin by swinging the arms upward as you push through the top leg, jumping upward as high as possible. Attempt to drive the opposite knee upward.
3. Land in the same position that you started, using your inside leg to decelerate the impact.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Single Dumbbell Raise',
  'shoulders - strength',
  '1. With a wide stance, hold a dumbell with both hands, grasping the head of the dumbbell instead of the handle. Your arms should be extended and hanging at the waist. This will be your starting position.
2. Raise the weight until it is above shoulder level, keeping your arms extended. Your torso and hips should remain stationary throughout the movement.
3. Return to the starting position and repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Single Leg Butt Kick',
  'quadriceps - plyometrics',
  '1. Begin by standing on one leg, with the bent knee raised. This will be your start position.
2. Using a countermovement jump, take off upward by extending the hip, knee, and ankle of the grounded leg.
3. Immediately flex the knee and attempt to touch your butt with the heel of your jumping leg.
4. Return the leg to a partially bent position underneath the hips and land. Your opposite leg should stay in relatively the same position throughout the drill.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Single Leg Glute Bridge',
  'glutes - strength',
  '1. Lay on the floor with your feet flat and knees bent.
2. Raise one leg off of the ground, pulling the knee to your chest. This will be your starting position.
3. Execute the movement by driving through the heel, extending your hip upward and raising your glutes off of the ground.
4. Extend as far as possible, pause and then return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Single Leg Push-off',
  'quadriceps - plyometrics',
  '1. Stand on the ground with one foot resting on the box, heel close to the edge.
2. Push off with your foot on top of the box, trying to gain as much height as possible by extending through the hip and knee.
3. Land with the same foot on top of the box, returning your other foot back to the start position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Abdominal',
  'abdominals - strength',
  '1. Lie down on the floor placing your feet either under something that will not move or by having a partner hold them. Your legs should be bent at the knees.
2. Place your hands behind your head and lock them together by clasping your fingers. This is the starting position.
3. Elevate your upper body so that it creates an imaginary V-shape with your thighs. Breathe out when performing this part of the exercise.
4. Once you feel the contraction for a second, lower your upper body back down to the starting position while inhaling.
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
  'Sit Squats',
  'quadriceps - stretching',
  '1. Stand with your feet shoulder width apart. This will be your starting position.
2. Begin the movement by flexing your knees and hips, sitting back with your hips.
3. Continue until you have squatted a portion of the way down, but are above parallel, and quickly reverse the motion until you return to the starting position. Repeat for 5-10 repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Skating',
  'quadriceps - cardio',
  '1. Roller skating is a fun activity which can be effective in improving cardiorespiratory fitness and muscular endurance. It requires relatively good balance and coordination. It is necessary to learn the basics of skating including turning and stopping and to wear protective gear to avoid possible injury.
2. You can skate at a comfortable pace for 30 minutes straight. If you want a cardio challenge, do interval skating — speed skate two minutes of every five minutes, using the remaining three minutes to recover. A 150 lb person will typically burn about 175 calories in 30 minutes skating at a comfortable pace, similar to brisk walking.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'cardio',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Sled Drag - Harness',
  'quadriceps - strongman',
  '1. To begin, load the sled with the desired weight and attach the pulling strap. You can pull with handles, use a harness, or attach the pulling strap to a weight belt.
2. Whether pulling forwards or backwards, lean in the direction of travel and progress by extending through the hips and knees.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Sled Overhead Backward Walk',
  'shoulders - strength',
  '1. Attach dual handles to a sled connected by a rope or chain. Load the sled to a light weight.
2. Face the sled, backing up until there is some tension in the line. Hold your hands directly above your head with your elbows extended. This will be your starting position.
3. Walk backwards, keeping your arms raised above your head. Avoid jerky movements.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Sled Overhead Triceps Extension',
  'triceps - strength',
  '1. Attach dual handles to a sled using a chain or rope. Load the sled to an appropriate load.
2. Facing away from the sled, step away until there is tension in the line. Raise your hands above your head, keeping them together, palms facing each other. Your elbows should be pointed upward with the elbows flexed. This will be your starting position.
3. Extend through the elbow to straighten the arm. Ensure that your upper arm stays in position to isolate the triceps.
4. Upon full extension, step forward to take the slack out of the line. You may keep your feet staggered for more stability.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Sled Push',
  'quadriceps - strongman',
  '1. Load your pushing sled with the desired weight.
2. Take an athletic posture, leaning into the sled with your arms fully extended, grasping the handles. Push the sled as fast as possible, focusing on extending your hips and knees to strengthen your posterior chain.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Sled Reverse Flye',
  'shoulders - strength',
  '1. Attach dual handles to a sled connected by a rope or chain. Load the sled to a light weight.
2. Face the sled, backing up until there is some tension in the line. Take both handles at arms length at about waist level. Bend the knees slightly and keep your chest and head up. This will be your starting position.
3. Without flexing the elbow, pull the handles upward and apart, performing a reverse fly with some external rotation. Your palms should be facing forward as you do this.
4. Return to the starting position, taking a couple steps back to take the slack out of the line.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Sled Row',
  'middle back - strength',
  '1. Attach dual handles to a sled connected by a rope or chain. Load the sled to an appropriate weight. Face the sled, backing up until there is some tension in the line.
2. With a handle in each hand, bend the knees slightly, keep your head and chest up, and begin with your arms extended.
3. To initiate the movement, flex the elbow as you retract your shoulder blades, pulling the sled towards you.
4. Take a step or two back to get tension in the line and repeat.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Sledgehammer Swings',
  'abdominals - plyometrics',
  '1. You will need a tire and a sledgehammer for this exercise. Stand in front of the tire about two feet away from it with a staggered stance. Grip the sledgehammer.
2. If you are right handed, your left hand should be at the bottom of the handle, and your right hand should be choking up closer to the head.
3. As you bring the sledge up, your right hand slides toward the head; as you swing down, your right hand will slide down to join your left hand. Slam it down as hard as you can against the tire. Control the bounce of the hammer off of the tire.
4. Repeat on the other side.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Smith Incline Shoulder Raise',
  'shoulders - strength',
  '1. Place an incline bench underneath the smith machine. Place the barbell at a height that you can reach when lying down and your arms are almost fully extended. Once the weight you need is selected, lie down on the incline bench and make sure your shoulders are aligned right under the barbell.
2. Using a shoulder width pronated (palms forward) grip, lift the bar from the rack and hold it straight over you with a slight bend at the elbows. This will be your starting position.
3. As you breathe out, lift the bar up until your arms are fully extended. Note: The contraction should be felt around the shoulders.
4. After a second pause, bring the bar back down to the starting position as you breathe in.
5. Repeat the movement for the prescribed amount of repetitions.
6. When you are done, place the bar back in the rack.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Smith Machine Behind the Back Shrug',
  'traps - strength',
  '1. With the bar at thigh level, load an appropriate weight.
2. Stand with the bar behind you, taking a shoulder-width, pronated grip on the bar and unhook the weight. You should be standing up straight with your head and chest up and your arms extended. This will be your starting position.
3. Initiate the movement by shrugging your shoulders straight up. Do not flex the arms or wrist during the movement.
4. After a brief pause return the weight to the starting position.
5. Repeat for the desired number of repetitions before engaging the hooks to rack the weight.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Trapézio' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Smith Machine Bench Press',
  'chest - strength',
  '1. Place a flat bench underneath the smith machine. Now place the barbell at a height that you can reach when lying down and your arms are almost fully extended. Once the weight you need is selected, lie down on the flat bench. Using a pronated grip that is wider than shoulder width, unlock the bar from the rack and hold it straight over you with your arms locked. This will be your starting position.
2. As you breathe in, come down slowly until you feel the bar on your middle chest.
3. After a second pause, bring the bar back to the starting position as you breathe out and push the bar using your chest muscles. Lock your arms in the contracted position, hold for a second and then start coming down slowly again. Tip: It should take at least twice as long to go down than to come up.
4. Repeat the movement for the prescribed amount of repetitions.
5. When you are done, lock the bar back in the rack.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Smith Machine Bent Over Row',
  'middle back - strength',
  '1. Set the barbell attached to the smith machine to a height that is about 2 inches below your knees.
2. Bend your knees slightly and bring your torso forward, by bending at the waist, while keeping the back straight until it is almost parallel to the floor. Tip: Make sure that you keep the head up.
3. Now grasp the barbell using an overhand (pronated) grip and unlock it from the smith machine rack. Then let it hang directly in front of you as your arms hang extended perpendicular to the floor and your torso. This is your starting position.
4. While keeping the torso stationary, lift the barbell as you breathe out, keeping the elbows close to the body and not doing any force with the forearm other than holding the weights. On the top contracted position, squeeze the back muscles and hold for a second.
5. Slowly lower the weight again to the starting position as you inhale.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Smith Machine Calf Raise',
  'calves - strength',
  '1. Place a block or weight plate below the bar on the Smith machine. Set the bar to a position that best matches your height. Once the correct height is chosen and the bar is loaded, step onto the plates with the balls of your feet and place the bar on the back of your shoulders.
2. Take the bar with both hands facing forward. Rotate the bar to unrack it. This will be your starting position.
3. Raise your heels as high as possible by pushing off of the balls of your feet, flexing your calf at the top of the contraction. Your knees should remain extended. Hold the contracted position for a second before you start to go back down.
4. Return slowly to the starting position as you breathe in while lowering your heels.
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
  'Smith Machine Close-Grip Bench Press',
  'triceps - strength',
  '1. Place a flat bench underneath the smith machine. Place the barbell at a height that you can reach when lying down and your arms are almost fully extended. Once the weight you need is selected, lie down on the flat bench. Using a close and pronated grip (palms facing forward) that is around shoulder width, unlock the bar from the rack and hold it straight over you with your arms locked. This will be your starting position.
2. As you breathe in, come down slowly until you feel the bar on your middle chest. Tip: Make sure that as opposed to a regular bench press, you keep the elbows close to the torso at all times in order to maximize triceps involvement.
3. After a second pause, bring the bar back to the starting position as you breathe out and push the bar using your triceps muscles. Lock your arms in the contracted position, hold for a second and then start coming down slowly again. Tip: It should take at least twice as long to go down than to come up.
4. Repeat the movement for the prescribed amount of repetitions.
5. When you are done, lock the bar back in the rack.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Smith Machine Decline Press',
  'chest - strength',
  '1. Position a decline bench in the rack so that the bar will be above your chest. Load an appropriate weight and take your place on the bench.
2. Rotate the bar to unhook it from the rack and fully extend your arms. Your back should be slightly arched and your shoulder blades retracted. This will be your starting position.
3. Begin the movement by flexing your arms, lowering the bar to your chest.
4. Pause briefly, and then extend your arms to push the weight back to the starting position.
5. After completing the desired number of repetitions, rotate the bar to rack the weight.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Smith Machine Hang Power Clean',
  'hamstrings - strength',
  '1. Position the bar at knee height and load it to an appropriate weight.
2. Take a pronated grip on the bar outside of shoulder width and unhook the bar from the machine. Your arms should be fully extended with your head and chest up. Your elbows should be pointed out with your shoulders back and down. Your hips should be back, loading the tension into the hamstrings. This will be your starting position.
3. Initate the movement by forcefully extending the hips and knees, accelerating into the bar. Ensure that you keep your arms straight during this part of the motion.
4. Upon full extension, rebend the hips and knees to lower your receiving position.
5. Allow the arms to flex at this point, rotating the elbows around the bar to receive it on your shoulders.
6. Extend through the hips and knees to come to a standing position with the bar racked on your shoulders to complete the movement.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Smith Machine Hip Raise',
  'abdominals - strength',
  '1. Position a bench in the rack and load the bar to an appropriate weight. Lie down on the bench, placing the bottom of your feet against the bar. Unlock the bar and extend your legs. You may need to use your hands to assist you. For added stability grasp the sides of the Smith Machine. This will be your starting position.
2. Initiate the movement by rotating your pelvis, flexing your spine to raise your hips off of the bench. Maintain a slight bend in the knees throughout the motion.
3. After a brief pause, return the hips to the bench.
4. Repeat for the desired number of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Smith Machine Incline Bench Press',
  'chest - strength',
  '1. Place an incline bench underneath the smith machine. Place the barbell at a height that you can reach when lying down and your arms are almost fully extended. Once the weight you need is selected, lie down on the incline bench and make sure your upper chest is aligned with the barbell. Using a pronated grip (palms facing forward) that is wider than shoulder width, unlock the bar from the rack and hold it straight over you with your arms locked. This will be your starting position.
2. As you breathe in, come down slowly until you feel the bar on your upper chest.
3. After a second pause, bring the bar back to the starting position as you breathe out and push the bar using your chest muscles. Lock your arms in the contracted position, hold for a second and then start coming down slowly again. Tip: It should take at least twice as long to go down than to come up.
4. Repeat the movement for the prescribed amount of repetitions.
5. When you are done, place the bar back in the rack.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Smith Machine Leg Press',
  'quadriceps - strength',
  '1. Position a Smith machine bar a couple feet off of the ground. Ensure that it is resting on the safeties. After loading the bar to an appropriate weight, lie underneath the bar. Place the middle of your feet on the bar, tucking your knees to your chest. This will be your starting position.
2. Begin the movement by driving through your feet to move the bar upward, extending the hips and knees. Do not lock out your knees.
3. At the top of the motion, pause briefly before returning to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Smith Machine One-Arm Upright Row',
  'shoulders - strength',
  '1. With the bar at thigh level, load an appropriate weight.
2. Take a wide grip on the bar and unhook the weight, removing your off hand from the bar. Your arm should be extended as you stand up straight with your head and chest up. This will be your starting position.
3. Begin the movement by flexing the elbow, raising the upper arm with the elbow pointed out. Continue until your upper arm is parallel to the floor.
4. After a brief pause, return the weight to the starting position.
5. Repeat for the desired number of repetitions before engaging the hooks to rack the weight.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Smith Machine Overhead Shoulder Press',
  'shoulders - strength',
  '1. To begin, place a flat bench (or preferably one with back support) underneath a smith machine. Position the barbell at a height so that when seated on the flat bench, the arms must be almost fully extended to reach the barbell.
2. Once you have the correct height, sit slightly in behind the barbell so that there is an imaginary straight line from the tip of your nose to the barbell. Your feet should be stationary. Grab the barbell with the palms facing forward, unlock it and lift it up so that your arms are fully extended. This is the starting position.
3. Slowly begin to lower the barbell until it is level with your chin while inhaling.
4. Then lift the barbell back to the starting position using your shoulders while exhaling.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Smith Machine Pistol Squat',
  'quadriceps - strength',
  '1. To begin, first set the bar to a position that best matches your height. Step under it and position the bar across the back of your shoulders.
2. Take the bar with your hands facing forward, unlock it and lift it off the rack by extending your legs. 3
3. Move one foot forward about 12 inches in front of the bar. Extend the other leg out in front of you, holding it off the ground. Look forward at all times and maintain a neutral or slightly arched spine. This will be your starting position.
4. Maintaining good posture, lower yourself by flexing the knee and hip, going down as far as flexibility allows.
5. Pause briefly at the bottom and then return to the starting position by driving through the heel of your foot, extending the knee and hip.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Smith Machine Reverse Calf Raises',
  'calves - strength',
  '1. Adjust the barbell on the smith machine to fit your height and align a raised platform right under the bar.
2. Stand on the platform with the heels of your feet secured on top of it with the balls of your feet extending off it. Position your toes facing forward with a shoulder width stance.
3. Now, place your shoulders under the barbell while maintaining the foot positioning described and push the barbell up by extending your hips and knees until your torso is standing erect. The knees should be kept with a slight bend; never locked. This will be your starting position. Tip: The barbell on your back is only for balance purposes.
4. Raise the balls of your feet as you breathe out by extending your toes as high as possible and flexing your calf. Ensure that the knee is kept stationary at all times. There should be no bending at any time. Hold the contracted position for a second before you start to go back down.
5. Slowly go back down to the starting position as you breathe in by lowering the balls of your feet and toes.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Panturrilha' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Smith Machine Squat',
  'quadriceps - strength',
  '1. To begin, first set the bar on the height that best matches your height. Once the correct height is chosen and the bar is loaded, step under the bar and place the back of your shoulders (slightly below the neck) across it.
2. Hold on to the bar using both arms at each side (palms facing forward), unlock it and lift it off the rack by first pushing with your legs and at the same time straightening your torso.
3. Position your legs using a shoulder width medium stance with the toes slightly pointed out. Keep your head up at all times and also maintain a straight back. This will be your starting position. (Note: For the purposes of this discussion we will use the medium stance which targets overall development; however you can choose any of the three stances discussed in the foot stances section).
4. Begin to slowly lower the bar by bending the knees as you maintain a straight posture with the head up. Continue down until the angle between the upper leg and the calves becomes slightly less than 90-degrees (which is the point in which the upper legs are below parallel to the floor). Inhale as you perform this portion of the movement. Tip: If you performed the exercise correctly, the front of the knees should make an imaginary straight line with the toes that is perpendicular to the front. If your knees are past that imaginary line (if they are past your toes) then you are placing undue stress on the knee and the exercise has been performed incorrectly.
5. Begin to raise the bar as you exhale by pushing the floor with the heel of your foot as you straighten the legs again and go back to the starting position.
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
  'Smith Machine Stiff-Legged Deadlift',
  'hamstrings - strength',
  '1. To begin, set the bar on the smith machine to a height that is around the middle of your thighs. Once the correct height is chosen and the bar is loaded, grasp the bar using a pronated (palms forward) grip that is shoulder width apart. You may need some wrist wraps if using a significant amount of weight.
2. Lift the bar up by fully extending your arms while keeping your back straight. Stand with your torso straight and your legs spaced using a shoulder width or narrower stance. The knees should be slightly bent. This is your starting position.
3. Keeping the knees stationary, lower the barbell to over the top of your feet by bending at the waist while keeping your back straight. Keep moving forward as if you were going to pick something from the floor until you feel a stretch on the hamstrings. Exhale as you perform this movement
4. Start bringing your torso up straight again as soon as you feel the hamstrings stretch by extending your hips and waist until you are back at the starting position. Inhale as you perform this movement.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Smith Machine Upright Row',
  'traps - strength',
  '1. To begin, set the bar on the smith machine to a height that is around the middle of your thighs. Once the correct height is chosen and the bar is loaded, grasp the bar using a pronated (palms forward) grip that is shoulder width apart. You may need some wrist wraps if using a significant amount of weight.
2. Lift the barbell up and fully extend your arms with your back straight. There should be a slight bend at the elbows. This is the starting position.
3. Use your side shoulders to lift the bar as you exhale. The bar should be close to the body as you move it up. Continue to lift it until it nearly touches your chin. Tip: Your elbows should drive the motion. As you lift the bar, your elbows should always be higher than your forearms. Also, keep your torso stationary and pause for a second at the top of the movement.
4. Lower the bar back down slowly to the starting position. Inhale as you perform this portion of the movement.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Trapézio' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Smith Single-Leg Split Squat',
  'quadriceps - strength',
  '1. To begin, place a flat bench 2-3 feet behind the smith machine. Then, set the bar on the height that best matches your height. Once the correct height is chosen and the bar is loaded, step under the bar and place the back of your shoulders (slightly below the neck) across it.
2. Hold on to the bar using both arms at each side (palms facing forward), unlock it and lift it off the rack by first pushing with your legs and at the same time straightening your torso.
3. Position your legs by placing one foot slightly forward under the bar and extending your other leg back and place the top of your foot on the bench. This will be your starting position
4. Begin to slowly lower the bar by bending the knee as you maintain a straight posture with the head up. Continue down until the angle between the upper leg and the calf becomes slightly less than 90-degrees (which is the point in which the upper legs are below parallel to the floor). Inhale as you perform this portion of the movement. Tip: If you performed the exercise correctly, the front of the knee should make an imaginary straight line with the toes that is perpendicular to the front. If your knee is past that imaginary line (if it is past your toes) then you are placing undue stress on the knee and the exercise has been performed incorrectly.
5. Begin to raise the bar as you exhale by pushing the floor with the heel of your foot mainly as you straighten your leg again and go back to the starting position.
6. Repeat for the recommended amount of repetitions.
7. Switch legs and repeat the movement.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Arranco (Snatch)',
  'quadriceps - olympic weightlifting',
  '1. Place your feet at a shoulder width stance with the barbell resting right above the connection between the toes and the rest of the foot.
2. With a palms facing down grip, bend at the knees and keeping the back flat grab the bar using a wider than shoulder width grip. Bring the hips down and make sure that your body drops as if you were going to sit on a chair. This will be your starting position.
3. Start pushing the floor as if it were a moving platform with your feet and simultaneously start lifting the barbell keeping it close to your legs.
4. As the bar reaches the middle of your thighs, push the floor with your legs and lift your body to a complete extension in an explosive motion.
5. Lift your shoulders back in a shrugging movement as you bring the bar up while lifting your elbows out to the side and keeping them above the bar for as long as possible.
6. Now in a very quick but powerful motion, you have to get your body under the barbell when it has reached a high enough point where it can be controlled and drop while locking your arms and holding the barbell overhead as you assume a squat position.
7. Finalize the movement by rising up out of the squat position to finish the lift. At the end of the lift both feet should be on line and the arms fully extended holding the barbell overhead.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Snatch Balance',
  'quadriceps - olympic weightlifting',
  '1. Begin with the feet in the pulling position, the bar racked across the back of the shoulders, and the hands placed in a wide snatch grip.
2. Pop the bar with an abrupt dip and drive of the knees, and aggressively drive under the bar, transitioning the feet into the receiving position.
3. Receive the bar locked out overhead near the bottom of the squat. The torso should remain vertical, lowering the hips between the legs.
4. Continue to descend to full depth, and return to a standing position. Carefully lower the weight.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Snatch Deadlift',
  'hamstrings - olympic weightlifting',
  '1. The snatch deadlift strengthens the first pull of the snatch. Begin with a wide snatch grip with the barbell placed on the platform. The feet should be directly under the hips, with the feet turned out. Squat down to the bar, keeping the back in absolute extension with the head facing forward.
2. Initiate the movement by driving through the heels, raising the hips. The back angle should remain the same until the bar passes the knees.
3. At that point, drive your hips through the bar as you lay back. Return the bar to the platform by reversing the motion.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Snatch Pull',
  'hamstrings - strength',
  '1. With a barbell on the floor close to the shins, take a wide snatch grip. Lower your hips with the weight focused on the heels, back straight, head facing forward, chest up, with your shoulders just in front of the bar. This will be your starting position.
2. Begin the first pull by driving through the heels, extending your knees. Your back angle should stay the same, and your arms should remain straight. Move the weight with control as you continue to above the knees.
3. Next comes the second pull, the main source of acceleration for the pull. As the bar approaches the mid-thigh position, begin extending through the hips. In a jumping motion, accelerate by extending the hips, knees, and ankles, using speed to move the bar upward.
4. There should be no need to actively pull through the arms to accelerate the weight; at the end of the second pull, the body should be fully extended, leaning slightly back. Full extension should be violent and abrupt, and ensure that you do not prolong the extension for longer than necessary.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Snatch Shrug',
  'traps - olympic weightlifting',
  '1. Begin with a wide grip, with the bar hanging at the mid thigh position. You can use a hook or overhand grip. Your back should be straight and inclined slightly forward.
2. Shrug your shoulders towards your ears. While this exercise can usually by loaded with heavier weight than a snatch, avoid overloading to the point that the execution slows down.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Trapézio' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Snatch from Blocks',
  'quadriceps - olympic weightlifting',
  '1. Begin with a loaded barbell on boxes or stands of the desired height. A wide grip should be taken on the bar. The feet should be directly below the hips, with the feet turned out as needed. Lower the hips, with the chest up and the head looking forward. The shoulders should be just in front of the bar, with the elbows pointed out. This will be the starting position.
2. Begin the first pull by driving through the front of the heels, raising the bar from the boxes.
3. Transition into the second pull by extending through the hips knees and ankles, driving the bar up as quickly as possible. The bar should be close to the body. At peak extension, shrug the shoulders and allow the elbows to flex to the side.
4. As you move your feet into the receiving position, forcefully pull yourself below the bar as you elevate the bar overhead. The feet should move to just outside the hips, turned out as necessary. Receive the bar with your body as low as possible and the arms fully extended overhead.
5. Keeping the bar aligned over the front of the heels, your head and chest up, drive through heels of the feet to move to a standing position. Carefully return the weight to the boxes.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Speed Band Overhead Triceps',
  'triceps - strength',
  '1. For this exercise anchor a band to the ground. We used an incline bench and anchored the band to the base, standing over the bench. Alternatively, this could be performed standing on the band.
2. To begin, pull the band behind your head, holding it with a pronated grip and your elbows up. This will be your starting position.
3. To perform the movement, extend through the elbow to to straighten your arms, ensuring that you keep your upper arm in place.
4. Pause, and then return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Elástico/Banda' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Speed Box Squat',
  'quadriceps - powerlifting',
  '1. Attach bands to the bar that are securely anchored near the ground. You may need to choke the bands to get adequate tension.
2. Use a box of an appropriate height for this exercise. Load the bar to a weight that still requires effort, but isn''t so heavy that speed is compromised. Typically, that will be between 50-70% of your one rep max.
3. Position the bar on your upper back, shoulder blades retracted, back arched and everything tight head to toe. This will be the starting position.
4. Unrack the bar and position yourself in front of the box. Sit back with your hips until you are seated on the box, ensuring that you descend under control and don''t crash onto the surface.
5. Pause briefly, and explode off of the box, extending through the hips and knees.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Speed Squats',
  'quadriceps - strength',
  '1. This exercise is best performed inside a squat rack for safety purposes. To begin, first set the bar on a rack that best matches your height. Once the correct height is chosen and the bar is loaded, step under the bar and place the back of your shoulders (slightly below the neck) across it.
2. Hold on to the bar using both arms at each side and lift it off the rack by first pushing with your legs and at the same time straightening your torso.
3. Step away from the rack and position your legs using a shoulder width medium stance with the toes slightly pointed out. Keep your head up at all times as looking down will get you off balance and also maintain a straight back. This will be your starting position. (Note: For the purposes of this discussion we will use the medium stance which targets overall development; however you can choose any of the three stances discussed in the foot stances section).
4. Begin to lower the bar by bending the knees as you maintain a straight posture with the head up. Continue down until the angle between the upper leg and the calves becomes slightly less than 90-degrees (which is the point in which the upper legs are below parallel to the floor). Inhale as you perform this portion of the movement. Tip: If you performed the exercise correctly, the front of the knees should make an imaginary straight line with the toes that is perpendicular to the front. If your knees are past that imaginary line (if they are past your toes) then you are placing undue stress on the knee and the exercise has been performed incorrectly.
5. Begin to raise the bar as fast as possible without involving momentum as you exhale by pushing the floor with the heel of your foot mainly as you straighten the legs again and go back to the starting position. Note: You should perform these exercises as fast as possible but without breaking perfect form and without involving momentum.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Spell Caster',
  'abdominals - strength',
  '1. Hold a dumbbell in each hand with a pronated grip. Your feet should be wide with your hips and knees extended. This will be your starting position.
2. Begin the movement by pulling both of the dumbbells to one side next to your hip, rotating your torso.
3. Keeping your arms straight and the dumbbells parallel to the ground, rotate your torso to swing the weights to your opposite side.
4. Continue alternating, rotating from one side to the other until the set is complete.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Spider Crawl',
  'abdominals - strength',
  '1. Begin in a prone position on the floor. Support your weight on your hands and toes, with your feet together and your body straight. Your arms should be bent to 90 degrees. This will be your starting position.
2. Initiate the movement by raising one foot off of the ground. Externally rotate the leg and bring the knee toward your elbow, as far forward as possible.
3. Return this leg to the starting position and repeat on the opposite side.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Spider Curl',
  'biceps - strength',
  '1. Start out by setting the bar on the part of the preacher bench that you would normally sit on. Make sure to align the barbell properly so that it is balanced and will not fall off.
2. Move to the front side of the preacher bench (the part where the arms usually lay) and position yourself to lay at a 45 degree slant with your torso and stomach pressed against the front side of the preacher bench.
3. Make sure that your feet (especially the toes) are well positioned on the floor and place your upper arms on top of the pad located on the inside part of the preacher bench.
4. Use your arms to grab the barbell with a supinated grip (palms facing up) at about shoulder width apart or slightly closer from each other.
5. Slowly begin to lift the barbell upwards and exhale. Hold the contracted position for a second as you squeeze the biceps.
6. Slowly begin to bring the barbell back to the starting position as your breathe in. .
7. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Spinal Stretch',
  'middle back - stretching',
  '1. Sit in a chair so your back is straight and your feet planted on the floor.
2. Interlace your fingers behind your head, elbows out and your chin down.
3. Twist your upper body to one side about 3 times as far as you can. Then lean forward and twist your torso to reach your elbow to the floor on the inside of your knee.
4. Return to upright position and then repeat for your other side.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Split Clean',
  'quadriceps - olympic weightlifting',
  '1. With a barbell on the floor close to the shins, take an overhand grip just outside the legs. Lower your hips with the weight focused on the heels, back straight, head facing forward, chest up, with your shoulders just in front of the bar. This will be your starting position.
2. Begin the first pull by driving through the heels, extending your knees. Your back angle should stay the same, and your arms should remain straight. Move the weight with control as you continue to above the knees.
3. Next comes the second pull, the main source of acceleration for the clean. As the bar approaches the mid-thigh position, begin extending through the hips. In a jumping motion, accelerate by extending the hips, knees, and ankles, using speed to move the bar upward. There should be no need to actively pull through the arms to accelerate the weight; at the end of the second pull, the body should be fully extended, leaning slightly back, with the arms still extended.
4. As full extension is achieved, transition into the third pull by aggressively shrugging and flexing the arms with the elbows up and out. At peak extension, aggressively pull yourself down, rotating your elbows under the bar as you do so.
5. Receive the bar with the feet split, aggressively moving one foot forward and one foot back. The bar should be racked onto the protracted shoulders, lightly touching the throat with the hands relaxed. Continue to descend to the bottom position, which will help in the recovery.
6. Immediately recover by driving through the heels, keeping the torso upright and elbows up. Bring the feet together as you stand up.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Split Jerk',
  'quadriceps - olympic weightlifting',
  '1. Standing with the weight racked on the front of the shoulders, begin with the dip. With your feet directly under your hips, flex the knees without moving the hips backward.
2. Go down only slightly, and reverse direction as powerfully as possible. Drive through the heels create as much speed and force as possible, and be sure to move your head out of the way as the bar leaves the shoulders. At this moment as the feet leave the floor, the feet must be placed into the receiving position as quickly as possible.
3. In the brief moment the feet are not actively driving against the platform, the athlete''s effort to push the bar up will drive them down. The feet should be moved to a split stance, one foot forward, one foot back, with the knees partially bent. Receive the bar with the arms locked out overhead.
4. Return to a standing position, bringing the feet together.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Split Jump',
  'quadriceps - plyometrics',
  '1. Assume a lunge stance position with one foot forward with the knee bent, and the rear knee nearly touching the ground.
2. Ensure that the front knee is over the midline of the foot.
3. Extending through both legs, jump as high as possible, swinging your arms to gain lift.
4. As you jump, bring your feet together, and move them back to their initial positions as you land.
5. Absorb the impact by reverting back to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Split Snatch',
  'hamstrings - olympic weightlifting',
  '1. Begin with a loaded barbell on the floor. The bar should be close to or touching the shins, and a wide grip should be taken on the bar. The feet should be directly below the hips, with the feet turned out as needed. Lower the hips, with the chest up and the head looking forward. The shoulders should be just in front of the bar. This will be the starting position.
2. Begin the first pull by driving through the front of the heels, raising the bar from the ground. The back angle should stay the same until the bar passes the knees.
3. Transition into the second pull by extending through the hips knees and ankles, driving the bar up as quickly as possible. The bar should be close to the body. At peak extension, shrug the shoulders and allow the elbows to flex to the side.
4. As you move your feet into the receiving position, forcefully pull yourself below the bar as you elevate the bar overhead. The feet should move forcefully to a split position, one foot forward one foot back. Receive the bar with your body as low as possible and the arms fully extended overhead.
5. Keeping the bar aligned over the front of the heels, your head and chest up, drive through heels of the feet to move to a standing position, bringing your feet together.
6. Carefully return the weight to floor.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Split Squat with Dumbbells',
  'quadriceps - strength',
  '1. Position yourself into a staggered stance with the rear foot elevated and front foot forward.
2. Hold a dumbbell in each hand, letting them hang at the sides. This will be your starting position.
3. Begin by descending, flexing your knee and hip to lower your body down. Maintain good posture througout the movement. Keep the front knee in line with the foot as you perform the exercise.
4. At the bottom of the movement, drive through the heel to extend the knee and hip to return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Split Squats',
  'hamstrings - stretching',
  '1. Being in a standing position. Jump into a split leg position, with one leg forward and one leg back, flexing the knees and lowering your hips slightly as you do so.
2. As you descend, immediately reverse direction, standing back up and jumping, reversing the position of your legs. Repeat 5-10 times on each leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Squat Jerk',
  'quadriceps - strength',
  '1. Standing with the weight racked on the front of the shoulders, begin with the dip. With your feet directly under your hips, flex the knees without moving the hips backward. Go down only slightly, and reverse direction as powerfully as possible. Drive through the heels create as much speed and force as possible, and be sure to move your head out of the way as the bar leaves the shoulders.
2. At this moment as the feet leave the floor, the feet must be placed into the receiving position as quickly as possible. In the brief moment the feet are not actively driving against the platform, the athlete''s effort to push the bar up will drive them down. The feet should move forcefully to just outside the hips, turned out as necessary. Receive the bar with your body in a full squat and the arms fully extended overhead.
3. Keeping the bar aligned over the front of the heels, your head and chest up, drive throught heels of the feet to move to a standing position. Carefully return the weight to floor.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Squat with Bands',
  'quadriceps - powerlifting',
  '1. Set up the bands on the sleeves, secured to either band pegs, the rack, or dumbbells so that there is appropriate tension.
2. Begin by stepping under the bar and placing it across the back of the shoulders. Squeeze your shoulder blades together and rotate your elbows forward, attempting to bend the bar across your shoulders. Remove the bar from the rack, creating a tight arch in your lower back, and step back into position. Place your feet wide for more emphasis on the back, glutes, adductors, and hamstrings. Keep your head facing forward.
3. With your back, shoulders, and core tight, push your knees and butt out and you begin your descent. Sit back with your hips as much as possible. Ideally, your shins should be perpendicular to the ground. Lower bar position necessitates a greater torso lean to keep the bar over the heels. Continue until you break parallel, which is defined as the crease of the hip being in line with the top of the knee.
4. Keeping the weight on your heels and pushing your feet and knees out, drive upward as you lead the movement with your head. Continue upward, maintaining tightness head to toe, until you have returned to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Squat with Chains',
  'quadriceps - powerlifting',
  '1. To set up the chains, begin by looping the leader chain over the sleeves of the bar. The heavy chain should be attached using a snap hook. Adjust the length of the lead chain so that a few links are still on the floor at the top of the movement.
2. Begin by stepping under the bar and placing it across the back of the shoulders. Squeeze your shoulder blades together and rotate your elbows forward, attempting to bend the bar across your shoulders. Remove the bar from the rack, creating a tight arch in your lower back, and step back into position. Place your feet wide for more emphasis on the back, glutes, adductors, and hamstrings. Keep your head facing forward.
3. With your back, shoulders, and core tight, push your knees and butt out and you begin your descent. Sit back with your hips as much as possible. Ideally, your shins should be perpendicular to the ground. Lower bar position necessitates a greater torso lean to keep the bar over the heels. Continue until you break parallel, which is defined as the crease of the hip being in line with the top of the knee.
4. Keeping the weight on your heels and pushing your feet and knees out, drive upward as you lead the movement with your head. Continue upward, maintaining tightness head to toe, until you have returned to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Squat with Plate Movers',
  'quadriceps - strength',
  '1. To begin, first set the bar on a rack to just below shoulder level. Position a weight plate on the ground a couple feet back from the rack. Once the bar is loaded, step under it and place the back of your shoulders across it.
2. Hold on to the bar with both hands and lift it off the rack by first pushing with your legs and at the same time straighten your torso.
3. Step away from the rack and adopt a wide stance with the toes slightly pointed out, with one foot on the weight plate. Keep your head up at all times. This will be your starting position.
4. Begin to slowly lower the bar by bending the knees and hips. Continue down until the angle between the upper leg and the calves becomes slightly less than 90-degrees.
5. Raise the bar as you exhale by pushing the floor with the heels of your feet as you extend the hips and knees.
6. At the top of the movement, side step, bringing your feet together on the opposite side of the plate.
7. Using your inside foot, push the weight plate, sliding it across the floor to where you were just standing.
8. Place your inside foot on the weight plate, adopting a wide stance for the next repetition.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Squats - With Bands',
  'quadriceps - strength',
  '1. To start out, make sure that the exercise band is at an even split between both the left and right side of the body. To do this, use your hands to grab both sides of the band and place both feet in the middle of the band. Your feet should be shoulder width apart from each other.
2. When holding the bands, they should be the same height on each side. You should be using a pronated grip (palms facing forward) and have the handles of the bands next to your face for this exercise. This is the starting position.
3. Slowly start to bend the knees and lower the legs so that your thighs are parallel to the floor while exhaling.
4. Use the heel of your feet to push your body up to the starting position as you exhale.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Elástico/Banda' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Stairmaster',
  'quadriceps - cardio',
  '1. To begin, step onto the stairmaster and select the desired option from the menu. You can choose a manual setting, or you can select a program to run. Typically, you can enter your age and weight to estimate the amount of calories burned during exercise.
2. Pump your legs up and down in an established rhythm, driving the pedals down but not all the way to the floor. It is recommended that you maintain your grip on the handles so that you don''t fall. The handles can be used to monitor your heart rate to help you stay at an appropriate intensity.
3. Stairmasters offer convenience, cardiovascular benefits, and usually have less impact than running outside. They are typically much harder than other cardio equipment. A 150 lb person will typically burn over 300 calories in 30 minutes, compared to about 175 calories walking.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'intermediate',
  'cardio',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Alternating Dumbbell Press',
  'shoulders - strength',
  '1. Stand with a dumbbell in each hand. Raise the dumbbells to your shoulders with your palms facing forward and your elbows pointed out. This will be your starting position.
2. Extend one arm to press the dumbbell straight up, keeping your off hand in place. Do not lean or jerk the weight during the movement.
3. After a brief pause, return the weight to the starting position.
4. Repeat for the opposite side, continuing to alternate between arms.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Barbell Calf Raise',
  'calves - strength',
  '1. This exercise is best performed inside a squat rack for safety purposes. To begin, first set the bar on a rack that best matches your height. Once the correct height is chosen and the bar is loaded, step under the bar and place the bar on the back of your shoulders (slightly below the neck).
2. Hold on to the bar using both arms at each side and lift it off the rack by first pushing with your legs and at the same time straightening your torso.
3. Step away from the rack and position your legs using a shoulder width medium stance with the toes slightly pointed out. Keep your head up at all times as looking down will get you off balance and also maintain a straight back. The knees should be kept with a slight bend; never locked. This will be your starting position. Tip: For better range of motion you may also place the ball of your feet on a wooden block but be careful as this option requires more balance and a sturdy block.
4. Raise your heels as you breathe out by extending your ankles as high as possible and flexing your calf. Ensure that the knee is kept stationary at all times. There should be no bending at any time. Hold the contracted position by a second before you start to go back down.
5. Go back slowly to the starting position as you breathe in by lowering your heels as you bend the ankles until calves are stretched.
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
  'Standing Barbell Press Behind Neck',
  'shoulders - strength',
  '1. This exercise is best performed inside a squat rack for easier pick up of the bar. To begin, first set the bar on a rack that best matches your height. Once the correct height is chosen and the bar is loaded, step under the bar and place the back of your shoulders (slightly below the neck) across it.
2. Hold on to the bar using both arms at each side and lift it off the rack by first pushing with your legs and at the same time straightening your torso.
3. Step away from the rack and position your legs using a shoulder width medium stance with the toes slightly pointed out. Your back should be kept straight while performing this exercise. This will be your starting position.
4. Elevate the barbell overhead by fully extending your arms while breathing out.
5. Hold the contraction for a second and lower the barbell back down to the starting position by inhaling.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Bent-Over One-Arm Dumbbell Triceps Extension',
  'triceps - strength',
  '1. With a dumbbell in one hand and the palm facing your torso, bend your knees slightly and bring your torso forward, by bending at the waist, while keeping the back straight until it is almost parallel to the floor. Make sure that you keep the head up.
2. The upper arm should be close to the torso and parallel to the floor while the forearm is pointing towards the floor as the hand holds the weight. Tip: There should be a 90-degree angle between the forearm and the upper arm. This is your starting position.
3. Keeping the upper arms stationary, use the triceps to lift the weights as you exhale until the forearms are parallel to the floor and the whole arm is extended. Like many other arm exercises, only the forearm moves.
4. After a second contraction at the top, slowly lower the dumbbell back to the starting position as you inhale.
5. Repeat the movement for the prescribed amount of repetitions.
6. Switch arms and repeat the exercise.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Bent-Over Two-Arm Dumbbell Triceps Extension',
  'triceps - strength',
  '1. With a dumbbell in each hand and the palms facing your torso, bend your knees slightly and bring your torso forward, by bending at the waist, while keeping the back straight until it is almost parallel to the floor. Make sure that you keep the head up. The upper arms should be close to the torso and parallel to the floor while the forearms are pointing towards the floor as the hands hold the weights. Tip: There should be a 90-degree angle between the forearms and the upper arm. This is your starting position.
2. Keeping the upper arms stationary, use the triceps to lift the weights as you exhale until the forearms are parallel to the floor and the whole arms are extended. Like many other arm exercises, only the forearm moves.
3. After a second contraction at the top, slowly lower the dumbbells back to their starting position as you inhale.
4. Repeat the movement for the prescribed amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Biceps Cable Curl',
  'biceps - strength',
  '1. Stand up with your torso upright while holding a cable curl bar that is attached to a low pulley. Grab the cable bar at shoulder width and keep the elbows close to the torso. The palm of your hands should be facing up (supinated grip). This will be your starting position.
2. While holding the upper arms stationary, curl the weights while contracting the biceps as you breathe out. Only the forearms should move. Continue the movement until your biceps are fully contracted and the bar is at shoulder level. Hold the contracted position for a second as you squeeze the muscle.
3. Slowly begin to bring the curl bar back to starting position as your breathe in.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Biceps Stretch',
  'biceps - stretching',
  '1. Clasp your hands behind your back with your palms together, straighten arms and then rotate them so your palms face downward.
2. Raise your arms up and hold until you feel a stretch in your biceps.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Bradford Press',
  'shoulders - strength',
  '1. Place a loaded bar at shoulder level in a rack. With a pronated grip at shoulder width, begin with the bar racked across the front of your shoulders. This is your starting position.
2. Initiate the lift by extending the elbows to press the bar overhead. Avoid locking out the elbow as you move the weight behind your head.
3. Lower the bar down to the back of the head until your elbow forms a right angle.
4. Lift the bar back over your head by extending the elbows
5. Lower the bar down to the starting position.
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
  'Standing Cable Chest Press',
  'chest - strength',
  '1. Position dual pulleys to chest height and select an appropriate weight. Stand a foot or two in front of the cables, holding one in each hand. You can stagger your stance for better stability.
2. Position the upper arm at a 90 degree angle with the shoulder blades together. This will be your starting position.
3. Keeping the rest of the body stationary, extend through the elbows to press the handles forward, drawing them together in front of you.
4. Pause at the top of the motion, and return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Cable Lift',
  'abdominals - strength',
  '1. Connect a standard handle on a tower, and move the cable to the lowest pulley position.
2. With your side to the cable, grab the handle with one hand and step away from the tower. You should be approximately arm''s length away from the pulley, with the tension of the weight on the cable. Your outstretched arm should be aligned with the cable.
3. With your feet positioned shoulder width apart, squat down and grab the handle with both hands. Your arms should still be fully extended.
4. In one motion, pull the handle up and across your body until your arms are in a fully-extended position above your head.
5. Keep your back straight and your arms close to your body as you pivot your back foot and straighten your legs to get a full range of motion.
6. Retract your arms and then your body. Return to the neutral position in a slow and controlled manner.
7. Repeat to failure.
8. Then, reposition and repeat the same series of movements on the opposite side.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Cable Wood Chop',
  'abdominals - strength',
  '1. Connect a standard handle to a tower, and move the cable to the highest pulley position.
2. With your side to the cable, grab the handle with one hand and step away from the tower. You should be approximately arm''s length away from the pulley, with the tension of the weight on the cable. Your outstretched arm should be aligned with the cable.
3. With your feet positioned shoulder width apart, reach upward with your other hand and grab the handle with both hands. Your arms should still be fully extended.
4. In one motion, pull the handle down and across your body to your front knee while rotating your torso.
5. Keep your back and arms straight and core tight while you pivot your back foot and bend your knees to get a full range of motion.
6. Maintain your stance and straight arms. Return to the neutral position in a slow and controlled manner.
7. Repeat to failure.
8. Then, reposition and repeat the same series of movements on the opposite side.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Calf Raises',
  'calves - strength',
  '1. Adjust the padded lever of the calf raise machine to fit your height.
2. Place your shoulders under the pads provided and position your toes facing forward (or using any of the two other positions described at the beginning of the chapter). The balls of your feet should be secured on top of the calf block with the heels extending off it. Push the lever up by extending your hips and knees until your torso is standing erect. The knees should be kept with a slight bend; never locked. Toes should be facing forward, outwards or inwards as described at the beginning of the chapter. This will be your starting position.
3. Raise your heels as you breathe out by extending your ankles as high as possible and flexing your calf. Ensure that the knee is kept stationary at all times. There should be no bending at any time. Hold the contracted position by a second before you start to go back down.
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
  'Standing Concentration Curl',
  'biceps - strength',
  '1. Taking a dumbbell in your working hand, lean forward. Allow your working arm to hang perpendicular to the ground with the elbow pointing out. This will be your starting position.
2. Flex the elbow to curl the weight, keeping the upper arm stationary. At the top of the repetition, flex the biceps and pause.
3. Lower the dumbbell back to the starting position.
4. Repeat the movement for the prescribed amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Dumbbell Calf Raise',
  'calves - strength',
  '1. Stand with your torso upright holding two dumbbells in your hands by your sides. Place the ball of the foot on a sturdy and stable wooden board (that is around 2-3 inches tall) while your heels extend off and touch the floor. This will be your starting position.
2. With the toes pointing either straight (to hit all parts equally), inwards (for emphasis on the outer head) or outwards (for emphasis on the inner head), raise the heels off the floor as you exhale by contracting the calves. Hold the top contraction for a second.
3. As you inhale, go back to the starting position by slowly lowering the heels.
4. Repeat for the recommended amount of times.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Panturrilha' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Dumbbell Press',
  'shoulders - strength',
  '1. Standing with your feet shoulder width apart, take a dumbbell in each hand. Raise the dumbbells to head height, the elbows out and about 90 degrees. This will be your starting position.
2. Maintaining strict technique with no leg drive or leaning back, extend through the elbow to raise the weights together directly above your head.
3. Pause, and slowly return the weight to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Dumbbell Reverse Curl',
  'biceps - strength',
  '1. To begin, stand straight with a dumbbell in each hand using a pronated grip (palms facing down). Your arms should be fully extended while your feet are shoulder width apart from each other. This is the starting position.
2. While holding the upper arms stationary, curl the weights while contracting the biceps as you breathe out. Only the forearms should move. Continue the movement until your biceps are fully contracted and the dumbbells are at shoulder level. Hold the contracted position for a second as you squeeze the muscle.
3. Slowly begin to bring the dumbbells back to starting position as your breathe in.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Dumbbell Straight-Arm Front Delt Raise Above Head',
  'shoulders - strength',
  '1. Hold the dumbbells in front of your thighs, palms facing your thighs.
2. Keep your arms straight with a slight bend at the elbows but keep them locked. This will be your starting position.
3. Raise the dumbbells in a semicircular motion to arm''s length overhead as you exhale.
4. Slowly return to the starting position using the same path as you inhale.
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
  'Standing Dumbbell Triceps Extension',
  'triceps - strength',
  '1. To begin, stand up with a dumbbell held by both hands. Your feet should be about shoulder width apart from each other. Slowly use both hands to grab the dumbbell and lift it over your head until both arms are fully extended.
2. The resistance should be resting in the palms of your hands with your thumbs around it. The palm of the hands should be facing up towards the ceiling. This will be your starting position.
3. Keeping your upper arms close to your head with elbows in and perpendicular to the floor, lower the resistance in a semicircular motion behind your head until your forearms touch your biceps. Tip: The upper arms should remain stationary and only the forearms should move. Breathe in as you perform this step.
4. Go back to the starting position by using the triceps to raise the dumbbell. Breathe out as you perform this step.
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
  'Standing Dumbbell Upright Row',
  'traps - strength',
  '1. Grasp a dumbbell in each hand with a pronated (palms forward) grip that is slightly less than shoulder width. The dumbbells should be resting on top of your thighs. Your arms should be extended with a slight bend at the elbows and your back should be straight. This will be your starting position.
2. Use your side shoulders to lift the dumbbells as you exhale. The dumbbells should be close to the body as you move it up and the elbows should drive the motion. Continue to lift them until they nearly touch your chin. Tip: Your elbows should drive the motion. As you lift the dumbbells, your elbows should always be higher than your forearms. Also, keep your torso stationary and pause for a second at the top of the movement.
3. Lower the dumbbells back down slowly to the starting position. Inhale as you perform this portion of the movement.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Trapézio' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Elevated Quad Stretch',
  'quadriceps - stretching',
  '1. Start by standing with your back about two to three feet away from a bench or step.
2. Lift one leg behind you and rest your foot on the step,either on your instep or the ball of your foot, whichever you find most comfortable.
3. Keep your supporting knee slightly bent and avoid letting that knee extend out beyond your toes. Switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Front Barbell Raise Over Head',
  'shoulders - strength',
  '1. To begin, stand straight with a barbell in your hands. You should grip the bar with palms facing down and a closer than shoulder width grip apart from each other.
2. Your feet should be shoulder width apart from each other. Your elbows should be slightly bent. This is the starting position.
3. Lift the barbell up until it is directly over your head while exhaling. Make sure to keep your elbows slightly bent when performing each repetition.
4. Once you feel the contraction, begin to lower the barbell back down to the starting position as you inhale.
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
  'Standing Gastrocnemius Calf Stretch',
  'calves - stretching',
  '1. Place your right heel on a step with your knee extended and lean forward to grab your right toe with your right hand. Your left knee should be slightly bent and your back should be straight.
2. Support your weight on your left leg and place your left hand on your left thigh.
3. Pull your right toes toward your knee until you feel a stretch in your calf.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Panturrilha' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Hamstring and Calf Stretch',
  'hamstrings - stretching',
  '1. Being by looping a belt, band, or rope around one foot. While standing, place that foot forward.
2. Bend your back leg, while keeping the front one straight. Now raise the toes of your front foot off of the ground and lean forward.
3. Using the belt, pull on the top of the foot to increase the stretch in the calf. Hold for 10-20 seconds and repeat with the other foot.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Hip Circles',
  'abductors - stretching',
  '1. Begin standing on one leg, holding to a vertical support.
2. Raise the unsupported knee to 90 degrees. This will be your starting position.
3. Open the hip as far as possible, attempting to make a big circle with your knee.
4. Perform this movement slowly for a number of repetitions, and repeat on the other side.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Hip Flexors',
  'quadriceps - stretching',
  '1. Stand up straight with the spine vertical, the left foot slightly in front of the right.
2. Bend both knees and lift the back heel off the floor as you press the right hip forward. You can''t get a thorough, deep stretch in this position, however, because it''s hard to relax the hip flexor and stand on it at the same time. Switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Inner-Biceps Curl',
  'biceps - strength',
  '1. Stand up with a dumbbell in each hand being held at arms length. The elbows should be close to the torso. Your legs should be at about shoulder''s width apart from each other.
2. Rotate the palms of the hands so that they are facing inward in a neutral position. This will be your starting position.
3. While holding the upper arms stationary, curl the weights out while contracting the biceps as you breathe out. Your wrist should turn so that when the weights are fully elevated you have supinated grip (palms facing up).
4. Only the forearms should move. Continue the movement until your biceps are fully contracted and the dumbbells are at shoulder level. Tip: Keep the forearms aligned with your outer deltoids.
5. Hold the contracted position for a second as you squeeze the biceps.
6. Slowly begin to bring the dumbbells back to the starting position as your breathe in. Remember to rotate the wrists as you lower the weight in order to switch back to a neutral grip.
7. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Lateral Stretch',
  'abdominals - stretching',
  '1. Take a slightly wider than hip distance stance with your knees slightly bent.
2. Place your right hand on your right hip to support the spine.
3. Raise your left arm in a vertical line and place your left hand behind your head. Keep it there as you incline your torso to the right.
4. Keep your weight evenly distributed between both legs (don''t lean into your left hip). Switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Leg Curl',
  'hamstrings - strength',
  '1. Adjust the machine lever to fit your height and lie with your torso bent at the waist facing forward around 30-45 degrees (since an angled position is more favorable for hamstrings recruitment) with the pad of the lever on the back of your right leg (just a few inches under the calves) and the front of the right leg on top of the machine pad.
2. Keeping the torso bent forward, ensure your leg is fully stretched and grab the side handles of the machine. Position your toes straight. This will be your starting position.
3. As you exhale, curl your right leg up as far as possible without lifting the upper leg from the pad. Once you hit the fully contracted position, hold it for a second.
4. As you inhale, bring the legs back to the initial position. Repeat for the recommended amount of repetitions.
5. Perform the same exercise now for the left leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Long Jump',
  'quadriceps - plyometrics',
  '1. This drill is best done in sand or other soft landing surface. Ensure that you are able to measure distance. Stand in a partial squat stance with feet shoulder width apart.
2. Utilizing a big arm swing and a countermovement of the legs, jump forward as far as you can.
3. Attempt to land with your feet out in front you, reaching as far as possible with your legs.
4. Measure the distance from your landing point to the starting point and track results.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Low-Pulley Deltoid Raise',
  'shoulders - strength',
  '1. Start by standing to the right side of a low pulley row. Use your left hand to come across the body and grab a single handle attached to the low pulley with a pronated grip (palms facing down). Rest your arm in front of you. Your right hand should grab the machine for better support and balance.
2. Make sure that your back is erect and your feet are shoulder width apart from each other. This is the starting position.
3. Begin to use the left hand and come across your body out until it is elevated to shoulder height while exhaling.
4. Feel the contraction at the top for a second and begin to slowly lower the handle back down to the original starting position while inhaling.
5. Repeat for the recommended amount of repetitions.
6. Switch arms and repeat the exercise.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Low-Pulley One-Arm Triceps Extension',
  'triceps - strength',
  '1. Grab a single handle with your left arm next to the low pulley machine. Turn away from the machine keeping the handle to the side of your body with your arm fully extended. Now use both hands to elevate the single handle directly above the head with the palm facing forward. Keep your upper arm completely vertical (perpendicular to the floor) and put your right hand on your left elbow to help keep it steady. This is the starting position.
2. Keeping your upper arms close to your head (elbows in) and perpendicular to the floor, lower the resistance in a semicircular motion behind your head until your forearms touch your biceps. Tip: The upper arms should remain stationary and only the forearms should move. Breathe in as you perform this step.
3. Go back to the starting position by using the triceps to raise the single handle. Breathe out as you perform this step.
4. Repeat for the recommended amount of repetitions.
5. Switch arms and repeat the exercise.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Military Press',
  'shoulders - strength',
  '1. Start by placing a barbell that is about chest high on a squat rack. Once you have selected the weights, grab the barbell using a pronated (palms facing forward) grip. Make sure to grip the bar wider than shoulder width apart from each other.
2. Slightly bend the knees and place the barbell on your collar bone. Lift the barbell up keeping it lying on your chest. Take a step back and position your feet shoulder width apart from each other.
3. Once you pick up the barbell with the correct grip length, lift the bar up over your head by locking your arms. Hold at about shoulder level and slightly in front of your head. This is your starting position.
4. Lower the bar down to the collarbone slowly as you inhale.
5. Lift the bar back up to the starting position as you exhale.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Olympic Plate Hand Squeeze',
  'forearms - strength',
  '1. To begin, stand straight while holding a weight plate by the ridge at arm''s length in each hand using a neutral grip (palms facing in). You feet should be shoulder width apart from each other. This will be your starting position.
2. Lower the plates until the fingers are nearly extended but can still hold weights. Inhale as you lower the plates.
3. Now raise the plates back to the starting position as you exhale by closing your hands.
4. Repeat for the recommended amount of repetitions prescribed in your program.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Antebraço' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing One-Arm Cable Curl',
  'biceps - strength',
  '1. Start out by grabbing single handle next to the low pulley machine. Make sure you are far enough from the machine so that your arm is supporting the weight.
2. Make sure that your upper arm is stationary, perpendicular to the floor with elbows in and palms facing forward. Your non lifting arm should be grabbing your waist. This will allow you to keep your balance.
3. Slowly begin to curl the single handle upwards while keeping the upper arm stationary until your forearm touches your bicep while exhaling. Tip: Only the forearm should move.
4. Hold the contraction position as you squeeze the bicep and then lower the single handle back down to the starting position as you inhale.
5. Repeat for the recommended amount of repetitions.
6. Switch arms while performing this exercise.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing One-Arm Dumbbell Curl Over Incline Bench',
  'biceps - strength',
  '1. Stand on the back side of an incline bench as if you were going to be a spotter for someone. Have a dumbbell in one hand and rest it across the incline bench with a supinated (palms up) grip.
2. Position your non lifting hand at the corner or side of the incline bench. The chest should be pressed against the top part of the incline and your feet should be pressed against the floor at a wide stance. This is the starting position.
3. While holding the upper arm stationary, curl the dumbbell upward while contracting the biceps as you breathe out. Only the forearms should move. Continue the movement until your biceps are fully contracted and the dumbbell is at shoulder level. Hold the contracted position for a second.
4. Slowly begin to bring the dumbbells back to starting position as your breathe in.
5. Repeat for the recommended amount of repetitions.
6. Switch arms while performing this exercise.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing One-Arm Dumbbell Triceps Extension',
  'triceps - strength',
  '1. To begin, stand up with a dumbbell held in one hand. Your feet should be about shoulder width apart from each other. Now fully extend the arm with the dumbbell over your head. Tip: The small finger of your hand should be facing the ceiling and the palm of your hand should be facing forward. The dumbbell should be above your head.
2. This will be your starting position.
3. Keeping your upper arm close to your head (elbows in) and perpendicular to the floor, lower the resistance in a semicircular motion behind your head until your forearm touch your bicep. Tip: The upper arm should remain stationary and only the forearm should move. Breathe in as you perform this step.
4. Go back to the starting position by using the triceps to raise the dumbbell. Breathe out as you perform this step.
5. Repeat for the recommended amount of repetitions.
6. Switch arms and repeat the exercise.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Overhead Barbell Triceps Extension',
  'triceps - strength',
  '1. To begin, stand up holding a barbell or e-z bar using a pronated grip (palms facing forward) with your hands closer than shoulder width apart from each other. Your feet should be about shoulder width apart.
2. Now elevate the barbell above your head until your arms are fully extended. Keep your elbows in. This will be your starting position.
3. Keeping your upper arms close to your head and elbows in, perpendicular to the floor, lower the resistance in a semicircular motion behind your head until your forearms touch your biceps. Tip: The upper arms should remain stationary and only the forearms should move. Breathe in as you perform this step.
4. Go back to the starting position by using the triceps to raise the barbell. Breathe out as you perform this step.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Palm-In One-Arm Dumbbell Press',
  'shoulders - strength',
  '1. Start by having a dumbbell in one hand with your arm fully extended to the side using a neutral grip. Use your other arm to hold on to an incline bench to keep your balance.
2. Your feet should be shoulder width apart from each other. Now slowly lift the dumbbell up until you create a 90 degree angle with your arm. Note: Your forearm should be perpendicular to the floor. Continue to maintain a neutral grip throughout the entire exercise.
3. Slowly lift the dumbbell up until your arm is fully extended. This the starting position.
4. While inhaling lower the weight down until your arm is at a 90 degree angle again.
5. Feel the contraction for a second and then lift the weight back up towards the starting position while exhaling. Remember to hold on to the incline bench and keep your feet positioned to keep balance during the exercise.
6. Repeat for the recommended amount of repetitions.
7. Switch arms and repeat the exercise.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Palms-In Dumbbell Press',
  'shoulders - strength',
  '1. Start by having a dumbbell in each hand with your arm fully extended to the side using a neutral grip. Your feet should be shoulder width apart from each other. Now slowly lift the dumbbells up until you create a 90 degree angle with your arms. Note: Your forearms should be perpendicular to the floor. This the starting position.
2. Continue to maintain a neutral grip throughout the entire exercise. Slowly lift the dumbbells up until your arms are fully extended.
3. While inhaling lower the weights down until your arm is at a 90 degree angle again.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Palms-Up Barbell Behind The Back Wrist Curl',
  'forearms - strength',
  '1. Start by standing straight and holding a barbell behind your glutes at arm''s length while using a pronated grip (palms will be facing back away from the glutes) and having your hands shoulder width apart from each other.
2. You should be looking straight forward while your feet are shoulder width apart from each other. This is the starting position.
3. While exhaling, slowly elevate the barbell up by curling your wrist in a semi-circular motion towards the ceiling. Note: Your wrist should be the only body part moving for this exercise.
4. Hold the contraction for a second and lower the barbell back down to the starting position while inhaling.
5. Repeat for the recommended amount of repetitions.
6. When finished, lower the barbell down to the squat rack or the floor by bending the knees. Tip: It is easiest to either pick it up from a squat rack or have a partner hand it to you.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Antebraço' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Pelvic Tilt',
  'lower back - stretching',
  '1. Start off with your feet hip-distance apart.
2. Bend your knees slightly to keep them soft and springy.
3. You may want to move your pelvis forward and backward and back few times before holding the tailbone forward in this stretch.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Rope Crunch',
  'abdominals - strength',
  '1. Attach a rope to a high pulley and select an appropriate weight.
2. Stand with your back to the cable tower. Take the rope with both hands over your shoulders, holding it to your upper chest. This will be your starting position.
3. Perform the movement by flexing the spine, crunching the weight down as far as you can.
4. Hold the peak contraction for a moment before returning to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Soleus And Achilles Stretch',
  'calves - stretching',
  '1. Stand with your feet hip-distance apart, one foot slightly in front of the other.
2. Bend both knees, keeping your back heel on the floor. Switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Panturrilha' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Toe Touches',
  'hamstrings - stretching',
  '1. Stand with some space in front and behind you.
2. Bend at the waist, keeping your legs straight, until you can relax and let your upper body hang down in front of you. Let your arms and hands hang down naturally. Hold for 10 to 20 seconds.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Standing Towel Triceps Extension',
  'triceps - strength',
  '1. To begin, stand up with both arms fully extended above the head holding one end of a towel with both hands. Your elbows should be in and the arms perpendicular to the floor with the palms facing each other while your feet should be shoulder width apart from each other. This is the starting position.
2. Now communicate with your partner so that he/she can grip the other side of the towel to apply resistance. Keeping your upper arms close to your head (elbows in) and perpendicular to the floor, lower the resistance in a semicircular motion behind your head until your forearms touch your biceps. Tip: The upper arms should remain stationary and only the forearms should move. Breathe in as you perform this step.
3. Go back to the starting position by using the triceps to raise the towel. Breathe out as you perform this step.
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
  'Standing Two-Arm Overhead Throw',
  'shoulders - plyometrics',
  '1. Stand with your feet shoulder width apart holding a medicine ball in both hands. To begin, reach the medicine ball deep behind your head as you bend the knees slightly and lean back.
2. Violently throw the ball forward, flexing at the hip and using your whole body to complete the movement.
3. The medicine ball can be thrown to a partner or to a wall, receiving it as it bounces back.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Star Jump',
  'quadriceps - plyometrics',
  '1. Begin in a relaxed stance with your feet shoulder width apart and hold your arms close to the body.
2. To initiate the move, squat down halfway and explode back up as high as possible. Fully extend your entire body, spreading your legs and arms away from the body.
3. As you land, bring your limbs back in and absorb your impact through the legs.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Step-up with Knee Raise',
  'glutes - strength',
  '1. Stand facing a box or bench of an appropriate height with your feet together. This will be your starting position.
2. Begin the movement by stepping up, putting your left foot on the top of the bench. Extend through the hip and knee of your front leg to stand up on the box. As you stand on the box with your left leg, flex your right knee and hip, bringing your knee as high as you can.
3. Reverse this motion to step down off the box, and then repeat the sequence on the opposite leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Step Mill',
  'quadriceps - cardio',
  '1. To begin, step onto the stepmill and select the desired option from the menu. You can choose a manual setting, or you can select a program to run. Typically, you can enter your age and weight to estimate the amount of calories burned during exercise. Use caution so that you don''t trip as you climb the stairs. It is recommended that you maintain your grip on the handles so that you don''t fall.
2. Stepmills offer convenience, cardiovascular benefits, and usually have less impact than running outside while offering a similar rate of calories burned. They are typically much harder than other cardio equipment. A 150 lb person will typically burn over 300 calories in 30 minutes, compared to about 175 calories walking.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'intermediate',
  'cardio',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Stiff-Legged Barbell Deadlift',
  'hamstrings - strength',
  '1. Grasp a bar using an overhand grip (palms facing down). You may need some wrist wraps if using a significant amount of weight.
2. Stand with your torso straight and your legs spaced using a shoulder width or narrower stance. The knees should be slightly bent. This is your starting position.
3. Keeping the knees stationary, lower the barbell to over the top of your feet by bending at the hips while keeping your back straight. Keep moving forward as if you were going to pick something from the floor until you feel a stretch on the hamstrings. Inhale as you perform this movement.
4. Start bringing your torso up straight again by extending your hips until you are back at the starting position. Exhale as you perform this movement.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Stiff-Legged Dumbbell Deadlift',
  'hamstrings - strength',
  '1. Grasp a couple of dumbbells holding them by your side at arm''s length.
2. Stand with your torso straight and your legs spaced using a shoulder width or narrower stance. The knees should be slightly bent. This is your starting position.
3. Keeping the knees stationary, lower the dumbbells to over the top of your feet by bending at the waist while keeping your back straight. Keep moving forward as if you were going to pick something from the floor until you feel a stretch on the hamstrings. Exhale as you perform this movement
4. Start bringing your torso up straight again by extending your hips and waist until you are back at the starting position. Inhale as you perform this movement.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Stiff Leg Barbell Good Morning',
  'lower back - strength',
  '1. This exercise is best performed inside a squat rack for safety purposes. To begin, first set the bar on a rack that best matches your height. Once the correct height is chosen and the bar is loaded, step under the bar and place the back of your shoulders (slightly below the neck) across it.
2. Hold on to the bar using both arms at each side and lift it off the rack by first pushing with your legs and at the same time straightening your torso.
3. Step away from the rack and position your legs using a shoulder width medium stance. Keep your head up at all times as looking down will get you off balance and also maintain a straight back. This will be your starting position.
4. Keeping your legs stationary, move your torso forward by bending at the hips while inhaling. Lower your torso until it is parallel with the floor.
5. Begin to raise the bar as you exhale by elevating your torso back to the starting position.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Stomach Vacuum',
  'abdominals - stretching',
  '1. To begin, stand straight with your feet shoulder width apart from each other. Place your hands on your hips. This is the starting position.
2. Now slowly inhale as much air as possible and then start to exhale as much as possible while bringing your stomach in as much as possible and hold this position. Try to visualize your navel touching your backbone.
3. One isometric contraction is around 20 seconds. During the 20 second hold, try to breathe normally. Then inhale and bring your stomach back to the starting position.
4. Once you have practiced this exercise, try to perform this exercise for longer than 20 seconds. Tip: You can work your way up to 40-60 seconds.
5. Repeat for the recommended amount of sets.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Straight-Arm Dumbbell Pullover',
  'chest - strength',
  '1. Place a dumbbell standing up on a flat bench.
2. Ensuring that the dumbbell stays securely placed at the top of the bench, lie perpendicular to the bench (torso across it as in forming a cross) with only your shoulders lying on the surface. Hips should be below the bench and legs bent with feet firmly on the floor. The head will be off the bench as well.
3. Grasp the dumbbell with both hands and hold it straight over your chest at arms length. Both palms should be pressing against the underside one of the sides of the dumbbell. This will be your starting position.
Caution: Always ensure that the dumbbell used for this exercise is secure. Using a dumbbell with loose plates can result in the dumbbell falling apart and falling on your face.
4. While keeping your arms straight, lower the weight slowly in an arc behind your head while breathing in until you feel a stretch on the chest.
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
  'Straight-Arm Pulldown',
  'lats - strength',
  '1. You will start by grabbing the wide bar from the top pulley of a pulldown machine and using a wider than shoulder-width pronated (palms down) grip. Step backwards two feet or so.
2. Bend your torso forward at the waist by around 30-degrees with your arms fully extended in front of you and a slight bend at the elbows. If your arms are not fully extended then you need to step a bit more backwards until they are. Once your arms are fully extended and your torso is slightly bent at the waist, tighten the lats and then you are ready to begin.
3. While keeping the arms straight, pull the bar down by contracting the lats until your hands are next to the side of the thighs. Breathe out as you perform this step.
4. While keeping the arms straight, go back to the starting position while breathing in.
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
  'Straight Bar Bench Mid Rows',
  'middle back - strength',
  '1. Place a loaded barbell on the end of a bench. Standing on the bench behind the bar, take a medium, pronated grip. Stand with your hips back and chest up, maintaining a neutral spine. This will be your starting position.
2. Row the bar to your torso by retracting the shoulder blades and flexing the elbows. Use a controlled movement with no jerking.
3. After a brief pause, slowly return the bar to the starting position, ensuring to go all the way down.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Straight Raises on Incline Bench',
  'shoulders - strength',
  '1. Place a bar on the ground behind the head of an incline bench.
2. Lay on the bench face down. With a pronated grip, pick the barbell up from the floor, keeping your arms straight. Allow the bar to hang straight down. This will be your starting position.
3. To begin, raise the barbell out in front of your head while keeping your arms extended.
4. Return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Stride Jump Crossover',
  'quadriceps - plyometrics',
  '1. Stand to the side of a box with your inside foot on top of it, close to the edge.
2. Begin by swinging the arms upward as you push through the top leg, jumping upward as high as possible. Attempt to drive the opposite knee upward.
3. Land in the opposite position that you started, on the opposite side of the box. The foot that was initially on the box will now be on the ground, with the opposite foot now on the box.
4. Repeat the movement, crossing back over to the other side.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Levantamento Terra Sumo',
  'hamstrings - powerlifting',
  '1. Begin with a bar loaded on the ground. Approach the bar so that the bar intersects the middle of the feet. The feet should be set very wide, near the collars. Bend at the hips to grip the bar. The arms should be directly below the shoulders, inside the legs, and you can use a pronated grip, a mixed grip, or hook grip. Relax the shoulders, which in effect lengthens your arms.
2. Take a breath, and then lower your hips, looking forward with your head with your chest up. Drive through the floor, spreading your feet apart, with your weight on the back half of your feet. Extend through the hips and knees.
3. As the bar passes through the knees, lean back and drive the hips into the bar, pulling your shoulder blades together.
4. Return the weight to the ground by bending at the hips and controlling the weight on the way down.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Sumo Deadlift with Bands',
  'hamstrings - powerlifting',
  '1. To deadlift with short bands, simply loop them over the bar before you start, and step into them to set up. Ensure that they under the back half of your foot, directly where you are driving into the floor.
2. Begin with a bar loaded on the ground. Approach the bar so that the bar intersects the middle of the feet. The feet should be set very wide, near the collars. Bend at the hips to grip the bar. The arms should be directly below the shoulders, inside the legs, and you can use a pronated grip, a mixed grip, or hook grip.
3. Take a breath, and then lower your hips, looking forward with your head with your chest up. Drive through the floor, spreading your feet apart, with your weight on the back half of your feet. Extend through the hips and knees.
4. As the bar passes through the knees, lean back and drive the hips into the bar, pulling your shoulder blades together.
5. Return the weight to the ground by bending at the hips and controlling the weight on the way down.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Sumo Deadlift with Chains',
  'hamstrings - powerlifting',
  '1. You can attach the chains to the sleeves of the bar, or just drape the middle over the bar so there is a greater weight increase as you lift. Attempt to keep the ends of the chains away from the plates so you don''t hit them when you lower the weight.
2. Begin with a bar loaded on the ground. Approach the bar so that the bar intersects the middle of the feet. The feet should be set very wide, near the collars. Bend at the hips to grip the bar. The arms should be directly below the shoulders, inside the legs, and you can use a pronated grip, a mixed grip, or hook grip. Relax the shoulders, which in effect lengthens your arms.
3. Take a breath, and then lower your hips, looking forward with your head with your chest up. Drive through the floor, spreading your feet apart, with your weight on the back half of your feet. Extend through the hips and knees.
4. As the bar passes through the knees, lean back and drive the hips into the bar, pulling your shoulder blades together.
5. Return the weight to the ground by bending at the hips and controlling the weight on the way down.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Superman',
  'lower back - stretching',
  '1. To begin, lie straight and face down on the floor or exercise mat. Your arms should be fully extended in front of you. This is the starting position.
2. Simultaneously raise your arms, legs, and chest off of the floor and hold this contraction for 2 seconds. Tip: Squeeze your lower back to get the best results from this exercise. Remember to exhale during this movement. Note: When holding the contracted position, you should look like superman when he is flying.
3. Slowly begin to lower your arms, legs and chest back down to the starting position while inhaling.
4. Repeat for the recommended amount of repetitions prescribed in your program.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Supine Chest Throw',
  'triceps - plyometrics',
  '1. This drill is great for chest passes when you lack a partner or a wall of sufficient strength. Lay on the ground on your back with your knees bent.
2. Begin with the ball on your chest, held with both hands on the bottom.
3. Explode up, extending through the elbow to throw the ball directly above you as high as possible.
4. Catch the ball with both hands as it comes down.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Supine One-Arm Overhead Throw',
  'abdominals - plyometrics',
  '1. Lay on the ground on your back with your knees bent. Hold the ball with one hand, extending the arm fully behind your head. This will be your starting position.
2. Initiate the movement at the shoulder, throwing the ball directly forward of you as you sit up, attempting to go for maximum distance.
3. The ball can be thrown to a partner or bounced off of a wall.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Supine Two-Arm Overhead Throw',
  'abdominals - plyometrics',
  '1. Lay on the ground on your back with your knees bent.
2. Hold the ball with both hands, extending the arms fully behind your head. This will be your starting position.
3. Initiate the movement at the shoulder, throwing the ball directly forward of you as you sit up, attempting to go for maximum distance.
4. The ball can be thrown to a partner or bounced off of a wall.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Suspended Fallout',
  'abdominals - strength',
  '1. Adjust the straps so the handles are at an appropriate height, below waist level.
2. Begin standing and grasping the handles. Lean into the straps, moving to an incline push-up position. This will be your starting position.
3. Keeping your arms straight, lean further into the suspension straps, bringing your body closer to the ground, allowing your shoulders to extend, raising your arms up and over your head.
4. Maintain a neutral spine and keep the rest of your body straight, your shoulders being the only joints allowed to move.
5. Pause during the peak contraction, and then return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Suspended Push-Up',
  'chest - strength',
  '1. Anchor your suspension straps securely to the top of a rack or other object.
2. Leaning into the straps, take a handle in each hand and move into a push-up plank position. You should be as close to parallel to the ground as you can manage with your arms fully extended, maintaining good posture.
3. Maintaining a straight, rigid torso, descend slowly by allowing the elbows to flex.
4. Continue until your elbows break 90 degrees, pausing before you extend to return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Suspended Reverse Crunch',
  'abdominals - strength',
  '1. Secure a set of suspension straps with the handles hanging about a foot off of the ground. Move yourself into a pushup plank position facing away from the rack.
2. Place your feet into the handles. You should maintain a straight posture, not allowing the hips to sag. This will be your starting position.
3. Begin the movement by flexing the knees and hips, drawing the knees to your torso. As you do so, anteriorly tilt your pelvis, allowing your spine to flex.
4. At the top of the controlled motion, return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Suspended Row',
  'middle back - strength',
  '1. Suspend your straps at around chest height. Take a handle in each hand and lean back. Keep your body erect and your head and chest up. Your arms should be fully extended. This will be your starting position.
2. Begin by flexing the elbow to initiate the movement. Protract your shoulder blades as you do so.
3. At the completion of the motion pause, and then return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Suspended Split Squat',
  'quadriceps - strength',
  '1. Suspend your straps so the handles are 18-30 inches from the floor.
2. Facing away from the setup, place your rear foot into the handle behind you. Keep your head looking forward and your chest up, with your knee slightly bent. This will be your starting position.
3. Descend by flexing the knee and hips, lowering yourself to the ground. Keep your weight on the heel of your foot and maintain your posture throughout the exercise.
4. At the bottom of the movement, reverse the motion, extending through the hip and knee to return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Svend Press',
  'chest - strength',
  '1. Begin in a standing position.
2. Press two lightweight plates together with your hands. Hold the plates together close to your chest to create an isometric contraction in your chest muscles. Your fingers should be pointed forward. This is your starting position.
3. Squeeze the plates between your palms and extend your arms directly out in front of you in a controlled motion.
4. Pause at the top of the motion, and then slowly return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'T-Bar Row with Handle',
  'middle back - strength',
  '1. Position a bar into a landmine or in a corner to keep it from moving. Load an appropriate weight onto your end.
2. Stand over the bar, and position a Double D row handle around the bar next to the collar. Using your hips and legs, rise to a standing position.
3. Assume a wide stance with your hips back and your chest up. Your arms should be extended. This will be your starting position.
4. Pull the weight to your upper abdomen by retracting the shoulder blades and flexing the elbows. Do not jerk the weight or cheat during the movement.
5. After a brief pause, return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Tate Press',
  'triceps - strength',
  '1. Lie down on a flat bench with a dumbbell in each hand on top of your thighs. The palms of your hand will be facing each other.
2. By using your thighs to help you get the dumbbells up, clean the dumbbells one arm at a time so that you can hold them in front of you at shoulder width. Note: when holding the dumbbells in front of you, make sure your arms are wider than shoulder width apart from each other using a pronated (palms forward) grip. Allow your elbows to point out. This is your starting position.
3. Keeping the upper arms stationary, slowly move the dumbbells in and down in a semi circular motion until they touch the upper chest while inhaling. Keep full control of the dumbbells at all times and do not move the upper arms nor rest the dumbbells on the chest.
4. As you breathe out, move the dumbbells up using your triceps and the same semi-circular motion but in reverse. Attempt to keep the dumbbells together as they move up. Lock your arms in the contracted position, hold for a second and then start coming down again slowly again. Tip: It should take at least twice as long to go down than to come up.
5. Repeat the movement for the prescribed amount of repetitions of your training program.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'The Straddle',
  'hamstrings - stretching',
  '1. Begin in a seated, upright position. Start by extending your legs in front of you in a V.
2. With your hands on the floor, lean forward as far as possible. Hold for 10 to 20 seconds.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Thigh Abductor',
  'abductors - strength',
  '1. To begin, sit down on the abductor machine and select a weight you are comfortable with. When your legs are positioned properly, grip the handles on each side. Your entire upper body (from the waist up) should be stationary. This is the starting position.
2. Slowly press against the machine with your legs to move them away from each other while exhaling.
3. Feel the contraction for a second and begin to move your legs back to the starting position while breathing in. Note: Remember to keep your upper body stationary to prevent any injuries from occurring.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Thigh Adductor',
  'adductors - strength',
  '1. To begin, sit down on the adductor machine and select a weight you are comfortable with. When your legs are positioned properly on the leg pads of the machine, grip the handles on each side. Your entire upper body (from the waist up) should be stationary. This is the starting position.
2. Slowly press against the machine with your legs to move them towards each other while exhaling.
3. Feel the contraction for a second and begin to move your legs back to the starting position while breathing in. Note: Remember to keep your upper body stationary and avoid fast jerking motions in order to prevent any injuries from occurring.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Tire Flip',
  'quadriceps - strongman',
  '1. Begin by gripping the bottom of the tire on the tread, and position your feet back a bit. Your chest should be driving into the tire.
2. To lift the tire, extend through the hips, knees, and ankles, driving into the tire and up.
3. As the tire reaches a 45 degree angle, step forward and drive a knee into the tire. As you do so adjust your grip to the upper portion of the tire and push it forward as hard as possible to complete the turn. Repeat as necessary.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Toe Touchers',
  'abdominals - stretching',
  '1. To begin, lie down on the floor or an exercise mat with your back pressed against the floor. Your arms should be lying across your sides with the palms facing down.
2. Your legs should be touching each other. Slowly elevate your legs up in the air until they are almost perpendicular to the floor with a slight bend at the knees. Your feet should be parallel to the floor.
3. Move your arms so that they are fully extended at a 45 degree angle from the floor. This is the starting position.
4. While keeping your lower back pressed against the floor, slowly lift your torso and use your hands to try and touch your toes. Remember to exhale while perform this part of the exercise.
5. Slowly begin to lower your torso and arms back down to the starting position while inhaling. Remember to keep your arms straight out pointing towards your toes.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Torso Rotation',
  'abdominals - stretching',
  '1. Stand upright holding an exercise ball with both hands. Extend your arms so the ball is straight out in front of you. This will be your starting position.
2. Rotate your torso to one side, keeping your eyes on the ball as you move. Now, rotate back to the opposite direction. Repeat for 10-20 repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Trail Running/Walking',
  'quadriceps - cardio',
  '1. Running or hiking on trails will get the blood pumping and heart beating almost immediately. Make sure you have good shoes. While you use the muscles in your calves and buttocks to pull yourself up a hill, the knees, joints and ankles absorb the bulk of the pounding coming back down. Take smaller steps as you walk downhill, keep your knees bent to reduce the impact and slow down to avoid falling.
2. A 150 lb person can burn over 200 calories for 30 minutes walking uphill, compared to 175 on a flat surface. If running the trail, a 150 lb person can burn well over 500 calories in 30 minutes.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'cardio',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Trap Bar Deadlift',
  'quadriceps - strength',
  '1. For this exercise load a trap bar, also known as a hex bar, to an appropriate weight resting on the ground. Stand in the center of the apparatus and grasp both handles.
2. Lower your hips, look forward with your head and keep your chest up.
3. Begin the movement by driving through the heels and extend your hips and knees. Avoid rounding your back at all times.
4. At the completion of the movement, lower the weight back to the ground under control.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Tricep Dumbbell Kickback',
  'triceps - strength',
  '1. Start with a dumbbell in each hand and your palms facing your torso. Keep your back straight with a slight bend in the knees and bend forward at the waist. Your torso should be almost parallel to the floor. Make sure to keep your head up. Your upper arms should be close to your torso and parallel to the floor. Your forearms should be pointed towards the floor as you hold the weights. There should be a 90-degree angle formed between your forearm and upper arm. This is your starting position.
2. Now, while keeping your upper arms stationary, exhale and use your triceps to lift the weights until the arm is fully extended. Focus on moving the forearm.
3. After a brief pause at the top contraction, inhale and slowly lower the dumbbells back down to the starting position.
4. Repeat the movement for the prescribed amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Tricep Side Stretch',
  'triceps - stretching',
  '1. Bring right arm across your body and over your left shoulder, holding your elbow with your left hand, until you feel a stretch in your tricep. Then repeat for your other arm.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Triceps Overhead Extension with Rope',
  'triceps - strength',
  '1. Attach a rope to a low pulley. After selecting an appropriate weight, grasp the rope with both hands and face away from the cable.
2. Position your hands behind your head with your elbows point straight up. Your elbows should start out flexed, and you can stagger your stance and lean gently away from the machine to create greater stability. This will be your starting position.
3. To perform the movement, extend through the elbow while keeping the upper arm in position, raising your hands above your head.
4. Squeeze your triceps at the top of the movement, and slowly lower the weight back to the start position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Triceps Pushdown',
  'triceps - strength',
  '1. Attach a straight or angled bar to a high pulley and grab with an overhand grip (palms facing down) at shoulder width.
2. Standing upright with the torso straight and a very small inclination forward, bring the upper arms close to your body and perpendicular to the floor. The forearms should be pointing up towards the pulley as they hold the bar. This is your starting position.
3. Using the triceps, bring the bar down until it touches the front of your thighs and the arms are fully extended perpendicular to the floor. The upper arms should always remain stationary next to your torso and only the forearms should move. Exhale as you perform this movement.
4. After a second hold at the contracted position, bring the bar slowly up to the starting point. Breathe in as you perform this step.
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
  'Triceps Pushdown - Rope Attachment',
  'triceps - strength',
  '1. Attach a rope attachment to a high pulley and grab with a neutral grip (palms facing each other).
2. Standing upright with the torso straight and a very small inclination forward, bring the upper arms close to your body and perpendicular to the floor. The forearms should be pointing up towards the pulley as they hold the rope with the palms facing each other. This is your starting position.
3. Using the triceps, bring the rope down as you bring each side of the rope to the side of your thighs. At the end of the movement the arms are fully extended and perpendicular to the floor. The upper arms should always remain stationary next to your torso and only the forearms should move. Exhale as you perform this movement.
4. After holding for a second, at the contracted position, bring the rope slowly up to the starting point. Breathe in as you perform this step.
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
  'Triceps Pushdown - V-Bar Attachment',
  'triceps - strength',
  '1. Attach a V-Bar to a high pulley and grab with an overhand grip (palms facing down) at shoulder width.
2. Standing upright with the torso straight and a very small inclination forward, bring the upper arms close to your body and perpendicular to the floor. The forearms should be pointing up towards the pulley as they hold the bar. The thumbs should be higher than the small finger. This is your starting position.
3. Using the triceps, bring the bar down until it touches the front of your thighs and the arms are fully extended perpendicular to the floor. The upper arms should always remain stationary next to your torso and only the forearms should move. Exhale as you perform this movement.
4. After a second hold at the contracted position, bring the V-Bar slowly up to the starting point. Breathe in as you perform this step.
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
  'Triceps Stretch',
  'triceps - stretching',
  '1. Reach your hand behind your head, grasp your elbow and gently pull. Hold for 10 to 20 seconds, then switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Tuck Crunch',
  'abdominals - strength',
  '1. To begin, lie down on the floor or an exercise mat with your back pressed against the floor. Your arms should be lying across your sides with the palms facing down.
2. Your legs should be crossed by wrapping one ankle around the other. Slowly elevate your legs up in the air until your thighs are perpendicular to the floor with a slight bend at the knees. Note: Your knees and toes should be parallel to the floor as opposed to the thighs.
3. Move your arms from the floor and cross them so they are resting on your chest. This is the starting position.
4. While keeping your lower back pressed against the floor, slowly lift your torso. Remember to exhale while perform this part of the exercise.
5. Slowly begin to lower your torso back down to the starting position while inhaling.
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
  'Two-Arm Dumbbell Preacher Curl',
  'biceps - strength',
  '1. Grab a dumbbell with each arm and place the upper arms on top of the preacher bench or the incline bench. The dumbbell should be held at shoulder length. This will be your starting position.
2. As you breathe in, slowly lower the dumbbells until your upper arm is extended and the biceps is fully stretched.
3. As you exhale, use the biceps to curl the weights up until your biceps is fully contracted and the dumbbells are at shoulder height.
4. Squeeze the biceps hard for a second at the contracted position and repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Two-Arm Kettlebell Clean',
  'shoulders - strength',
  '1. Place two kettlebells between your feet. To get in the starting position, push your butt back and look straight ahead.
2. Clean the kettlebells to your shoulders by extending through the legs and hips as you raise the kettlebells towards your shoulders. Rotate your wrists as you do so.
3. Lower the kettlebells back to the starting position and repeat.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Two-Arm Kettlebell Jerk',
  'shoulders - strength',
  '1. Clean two kettlebells to your shoulders. Clean the kettlebells to your shoulders by extending through the legs and hips as you swing the kettlebells towards your shoulders. Rotate your wrists as you do so, so that the palms face forward. Squat down a few inches and reverse the motion rapidly driving both kettlebells overhead. Immediately after the initial push, squat down again and get under the kettlebells. Once the kettlebells are locked out, stand upright to complete the exercise.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Two-Arm Kettlebell Military Press',
  'shoulders - strength',
  '1. Clean two kettlebells to your shoulders. Clean the kettlebells to your shoulders by extending through the legs and hips as you swing the kettlebells towards your shoulders. Rotate your wrists as you do so, so that the palms face forward.
2. Press the kettlebells up and out. As the kettlebells pass your head, lean into the weights so that the kettlebells are racked behind your head. Make sure to contract your lats, butt, and stomach for added stability.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Two-Arm Kettlebell Row',
  'middle back - strength',
  '1. Place two kettlebells in front of your feet. Bend your knees slightly and then push your butt out as much as possible as you bend over to get in the starting position.
2. Grab both kettlebells and pull them to your stomach, retracting your shoulder blades and flexing the elbows. Keep your back straight. Lower and repeat.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Underhand Cable Pulldowns',
  'lats - strength',
  '1. Sit down on a pull-down machine with a wide bar attached to the top pulley. Adjust the knee pad of the machine to fit your height. These pads will prevent your body from being raised by the resistance attached to the bar.
2. Grab the pull-down bar with the palms facing your torso (a supinated grip). Make sure that the hands are placed closer than the shoulder width.
3. As you have both arms extended in front of you holding the bar at the chosen grip width, bring your torso back around 30 degrees or so while creating a curvature on your lower back and sticking your chest out. This is your starting position.
4. As you breathe out, pull the bar down until it touches your upper chest by drawing the shoulders and the upper arms down and back. Tip: Concentrate on squeezing the back muscles once you reach the fully contracted position and keep the elbows close to your body. The upper torso should remain stationary as your bring the bar to you and only the arms should move. The forearms should do no other work other than hold the bar.
5. After a second on the contracted position, while breathing in, slowly bring the bar back to the starting position when your arms are fully extended and the lats are fully stretched.
6. Repeat this motion for the prescribed amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Upper Back-Leg Grab',
  'hamstrings - stretching',
  '1. While seated, bend forward to hug your thighs from underneath with both arms.
2. Keep your knees together and your legs extended out as you bring your chest down to your knees. You can also stretch your middle back by pulling your back away from your knees as your hugging them.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Upper Back Stretch',
  'middle back - stretching',
  '1. Clasp fingers together with your thumbs pointing down, round your shoulders as you reach your hands forward.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Upright Barbell Row',
  'shoulders - strength',
  '1. Grasp a barbell with an overhand grip that is slightly less than shoulder width. The bar should be resting on the top of your thighs with your arms extended and a slight bend in your elbows. Your back should also be straight. This will be your starting position.
2. Now exhale and use the sides of your shoulders to lift the bar, raising your elbows up and to the side. Keep the bar close to your body as you raise it. Continue to lift the bar until it nearly touches your chin. Tip: Your elbows should drive the motion, and should always be higher than your forearms. Remember to keep your torso stationary and pause for a second at the top of the movement.
3. Lower the bar back down slowly to the starting position. Inhale as you perform this portion of the movement.
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
  'Upright Cable Row',
  'traps - strength',
  '1. Grasp a straight bar cable attachment that is attached to a low pulley with a pronated (palms facing your thighs) grip that is slightly less than shoulder width. The bar should be resting on top of your thighs. Your arms should be extended with a slight bend at the elbows and your back should be straight. This will be your starting position.
2. Use your side shoulders to lift the cable bar as you exhale. The bar should be close to the body as you move it up. Continue to lift it until it nearly touches your chin. Tip: Your elbows should drive the motion. As you lift the bar, your elbows should always be higher than your forearms. Also, keep your torso stationary and pause for a second at the top of the movement.
3. Lower the bar back down slowly to the starting position. Inhale as you perform this portion of the movement.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Trapézio' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Upright Row - With Bands',
  'traps - strength',
  '1. To begin, stand on an exercise band so that tension begins at arm''s length. Grasp the handles using a pronated (palms facing your thighs) grip that is slightly less than shoulder width. The handles should be resting on top of your thighs. Your arms should be extended with a slight bend at the elbows and your back should be straight. This will be your starting position.
2. Use your side shoulders to lift the handles as you exhale. The handles should be close to the body as you move them up. Continue to lift the handles until they nearly touches your chin. Tip: Your elbows should drive the motion. As you lift the handles, your elbows should always be higher than your forearms. Also, keep your torso stationary and pause for a second at the top of the movement.
3. Lower the handles back down slowly to the starting position. Inhale as you perform this portion of the movement.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Trapézio' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Elástico/Banda' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Upward Stretch',
  'shoulders - stretching',
  '1. Extend both hands straight above your head, palms touching.
2. Slowly push your hands up and back, keeping your back straight.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'V-Bar Pulldown',
  'lats - strength',
  '1. Sit down on a pull-down machine with a V-Bar attached to the top pulley.
2. Adjust the knee pad of the machine to fit your height. These pads will prevent your body from being raised by the resistance attached to the bar.
3. Grab the V-bar with the palms facing each other (a neutral grip). Stick your chest out and lean yourself back slightly (around 30-degrees) in order to better engage the lats. This will be your starting position.
4. Using your lats, pull the bar down as you squeeze your shoulder blades. Continue until your chest nearly touches the V-bar. Exhale as you execute this motion. Tip: Keep the torso stationary throughout the movement.
5. After a second hold on the contracted position, slowly bring the bar back to the starting position as you breathe in.
6. Repeat for the prescribed number of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'V-Bar Pullup',
  'lats - strength',
  '1. Start by placing the middle of the V-bar in the middle of the pull-up bar (assuming that the pull-up station you are using does not have neutral grip handles). The V-Bar handles will be facing down so that you can hang from the pull-up bar through the use of the handles.
2. Once you securely place the V-bar, take a hold of the bar from each side and hang from it. Stick your chest out and lean yourself back slightly in order to better engage the lats. This will be your starting position.
3. Using your lats, pull your torso up while leaning your head back slightly so that you do not hit yourself with the chin-up bar. Continue until your chest nearly touches the V-bar. Exhale as you execute this motion.
4. After a second hold on the contracted position, slowly lower your body back to the starting position as you breathe in.
5. Repeat for the prescribed number of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Vertical Swing',
  'hamstrings - plyometrics',
  '1. Allow the dumbbell to hang at arms length between your legs, holding it with both hands. Keep your back straight and your head up.
2. Swing the dumbbell between your legs, flexing at the hips and bending the knees slightly.
3. Powerfully reverse the motion by extending at the hips, knees, and ankles to propel yourself upward, swinging the dumbell over your head.
4. As you land, absorb the impact through your legs and draw the dumbbell to your torso before the next repetition.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Walking, Treadmill',
  'quadriceps - cardio',
  '1. To begin, step onto the treadmill and select the desired option from the menu. Most treadmills have a manual setting, or you can select a program to run. Typically, you can enter your age and weight to estimate the amount of calories burned during exercise. Elevation can be adjusted to change the intensity of the workout.
2. Treadmills offer convenience, cardiovascular benefits, and usually have less impact than walking outside. When walking, you should move at a moderate to fast pace, not a leisurely one. Being an activity of lower intensity, walking doesn''t burn as many calories as some other activities, but still provides great benefit. A 150 lb person will burn about 175 calories walking 4 miles per hour for 30 minutes, compared to 450 calories running twice as fast. Maintain proper posture as you walk, and only hold onto the handles when necessary, such as when dismounting or checking your heart rate.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'cardio',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Weighted Ball Hyperextension',
  'lower back - strength',
  '1. To begin, lie down on an exercise ball with your torso pressing against the ball and parallel to the floor. The ball of your feet should be pressed against the floor to help keep you balanced. Place a weighted plate under your chin or behind your neck. This is the starting position.
2. Slowly raise your torso up by bending at the waist and lower back. Remember to exhale during this movement.
3. Hold the contraction on your lower back for a second and lower your torso back down to the starting position while inhaling.
4. Repeat for the recommended amount of repetitions prescribed in your program.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Weighted Ball Side Bend',
  'abdominals - strength',
  '1. To begin, lie down on an exercise ball with your left side of the torso (waist, hips and shoulder) pressed against the ball.
2. Your feet should be on the floor while your legs are crossed and hanging from the ball. Hold a weighted plate with your right hand directly to the right side of your head. Tip: Make sure the smooth side of the plate is resting against your head.
3. Place your left arm across your torso so that your palm is on your obliques. There should be a right angle between your left forearm and upper arm. This is the starting position.
4. Raise the side of your torso up by laterally flexing at the waist while exhaling.
5. Hold the contraction for a second and slowly lower yourself back down to the starting position while inhaling.
6. Repeat for the recommended amount of repetitions.
7. Switch sides and repeat the exercise.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Weighted Bench Dip',
  'triceps - strength',
  '1. For this exercise you will need to place a bench behind your back and another one in front of you. With the benches perpendicular to your body, hold on to one bench on its edge with the hands close to your body, separated at shoulder width. Your arms should be fully extended.
2. The legs will be extended forward on top of the other bench. Your legs should be parallel to the floor while your torso is to be perpendicular to the floor. Have your partner place the dumbbell on your lap. Note: This exercise is best performed with a partner as placing the weight on your lap can be challenging and cause injury without assistance. This will be your starting position.
3. Slowly lower your body as you inhale by bending at the elbows until you lower yourself far enough to where there is an angle slightly smaller than 90 degrees between the upper arm and the forearm. Tip: Keep the elbows as close as possible throughout the movement. Forearms should always be pointing down.
4. Using your triceps to bring your torso up again, lift yourself back to the starting position while exhaling.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Weighted Crunches',
  'abdominals - strength',
  '1. Lie flat on your back with your feet flat on the ground or resting on a bench with your knees bent at a 90 degree angle.
2. Hold a weight to your chest, or you may hold it extended above your torso. This will be your starting position.
3. Now, exhale and slowly begin to roll your shoulders off the floor. Your shoulders should come up off the floor about 4 inches while your lower back remains on the floor.
4. At the top of the movement, flex your abdominals and hold for a brief pause.
5. Then inhale and slowly lower yourself back down to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Weighted Jump Squat',
  'quadriceps - strength',
  '1. Position a lightly loaded barbell across the back of your shoulders. You could also use a weighted vest, sandbag, or other type of resistance for this exercise.
2. The weight should be light enough that it doesn''t slow you down significantly. Your feet should be just outside of shoulder width with your head and chest up. This will be your starting position.
3. Using a countermovement, squat partially down and immediately reverse your direction to explode off of the ground, extending through your hips, knees, and ankles. Maintain good posture throughout the jump.
4. As you return to the ground, absorb the impact through your legs.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Weighted Pull Ups',
  'lats - strength',
  '1. Attach a weight to a dip belt and secure it around your waist. Grab the pull-up bar with the palms of your hands facing forward. For a medium grip, your hands should be spaced at shoulder width. Both arms should be extended in front of you holding the bar at the chosen grip.
2. You''ll want to bring your torso back about 30 degrees while creating a curvature in your lower back and sticking your chest out. This will be your starting position.
3. Now, exhale and pull your torso up until your head is above your hands. Concentrate on squeezing yourshoulder blades back and down as you reach the top contracted position.
4. After a brief moment at the top contracted position, inhale and slowly lower your torso back to the starting position with your arms extended and your lats fully stretched.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Weighted Sissy Squat',
  'quadriceps - strength',
  '1. Standing upright, with feet at shoulder width and toes raised, use one hand to hold onto the beams of a squat rack and the opposite arm to hold a plate on top of your chest. This is your starting position.
2. As you use one arm to hold yourself, bend at the knees and slowly lower your torso toward the ground by bringing your pelvis and knees forward. Inhale as you go down and stop when your upper and lower legs almost create a 90-degree angle. Hold the stretch position for a second.
3. After your one second hold, use your thigh muscles to bring your torso back up to the starting position. Exhale as you move up.
4. Repeat for the recommended amount of times.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Weighted Sit-Ups - With Bands',
  'abdominals - strength',
  '1. Start out by strapping the bands around the base of the decline bench. Place the handles towards the inside of the decline bench so that when lying down, you can reach for both of them.
2. Position your legs through the decline machine until they are secured. Now reach for the exercise bands with both hands. Use a pronated (palms forward) grip to grasp the handles. Position them near your collar bone and rotate your wrist to a neutral grip (palms facing the torso). Note: Your arms should remain stationary throughout the exercise. This is the starting position.
3. Move your torso upward until your upper body is perpendicular to the floor while exhaling. Hold the contraction for a second and lower your upper body back down to the starting position while inhaling.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Weighted Squat',
  'quadriceps - strength',
  '1. Start by positioning two flat benches shoulder width apart from each other. Stand on top of them and wrap the weighted belt around your waist with the amount of weight you feel comfortable with. Make sure your toes are facing out.
2. Once you are standing straight up with the weight hanging in between your legs, position your arms so that they are fully extended to the side of your body. This is the starting position.
3. Begin by bending the knees as you maintain a straight posture with the head up. Continue down until the angle between the upper leg and the calves becomes slightly less than 90-degrees (which is the point in which the upper legs are below parallel to the floor). Inhale as you perform this portion of the movement. Tip: If you performed the exercise correctly, the front of the knees should make an imaginary straight line with the toes that are perpendicular to the front. If your knees are past that imaginary line (if they are past your toes) then you are placing undue stress on the knee and the exercise has been performed incorrectly.
4. Begin to move the body back up by pushing the floor of the flat bench with the ball of your foot mainly as you straighten the legs again and go back to the starting position. Exhale as you perform this portion of the exercise.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Wide-Grip Barbell Bench Press',
  'chest - strength',
  '1. Lie back on a flat bench with feet firm on the floor. Using a wide, pronated (palms forward) grip that is around 3 inches away from shoulder width (for each hand), lift the bar from the rack and hold it straight over you with your arms locked. The bar will be perpendicular to the torso and the floor. This will be your starting position.
2. As you breathe in, come down slowly until you feel the bar on your middle chest.
3. After a second pause, bring the bar back to the starting position as you breathe out and push the bar using your chest muscles. Lock your arms and squeeze your chest in the contracted position, hold for a second and then start coming down slowly again. Tip: It should take at least twice as long to go down than to come up.
4. Repeat the movement for the prescribed amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Wide-Grip Decline Barbell Bench Press',
  'chest - strength',
  '1. Lie back on a decline bench with the feet securely locked at the front of the bench. Using a wide, pronated (palms forward) grip that is around 3 inches away from shoulder width (for each hand), lift the bar from the rack and hold it straight over you with your arms locked. The bar will be perpendicular to the torso and the floor. This will be your starting position.
2. As you breathe in, come down slowly until you feel the bar on your lower chest.
3. After a second pause, bring the bar back to the starting position as you breathe out and push the bar using your chest muscles. Lock your arms and squeeze your chest in the contracted position, hold for a second and then start coming down slowly again. Tip: It should take at least twice as long to go down than to come up.
4. Repeat the movement for the prescribed amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Wide-Grip Decline Barbell Pullover',
  'chest - strength',
  '1. Lie down on a decline bench with both legs securely locked in position. Reach for the barbell behind the head using a pronated grip (palms facing out). Make sure to grab the barbell wider than shoulder width apart for this exercise. Slowly lift the barbell up from the floor by using your arms.
2. When positioned properly, your arms should be fully extended and perpendicular to the floor. This is the starting position.
3. Begin by moving the barbell back down in a semicircular motion as if you were going to place it on the floor, but instead, stop when the arms are parallel to the floor. Tip: Keep the arms fully extended at all times. The movement should only happen at the shoulder joint. Inhale as you perform this portion of the movement.
4. Now bring the barbell up while exhaling until you are back at the starting position. Remember to keep full control of the barbell at all times.
5. Repeat the movement for the prescribed amount of repetitions of your training program.
6. When finished with your set, slowly lower the barbell back down until it is level with your head and release it.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Wide-Grip Lat Pulldown',
  'lats - strength',
  '1. Sit down on a pull-down machine with a wide bar attached to the top pulley. Make sure that you adjust the knee pad of the machine to fit your height. These pads will prevent your body from being raised by the resistance attached to the bar.
2. Grab the bar with the palms facing forward using the prescribed grip. Note on grips: For a wide grip, your hands need to be spaced out at a distance wider than shoulder width. For a medium grip, your hands need to be spaced out at a distance equal to your shoulder width and for a close grip at a distance smaller than your shoulder width.
3. As you have both arms extended in front of you holding the bar at the chosen grip width, bring your torso back around 30 degrees or so while creating a curvature on your lower back and sticking your chest out. This is your starting position.
4. As you breathe out, bring the bar down until it touches your upper chest by drawing the shoulders and the upper arms down and back. Tip: Concentrate on squeezing the back muscles once you reach the full contracted position. The upper torso should remain stationary and only the arms should move. The forearms should do no other work except for holding the bar; therefore do not try to pull down the bar using the forearms.
5. After a second at the contracted position squeezing your shoulder blades together, slowly raise the bar back to the starting position when your arms are fully extended and the lats are fully stretched. Inhale during this portion of the movement.
6. Repeat this motion for the prescribed amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Wide-Grip Pulldown Behind The Neck',
  'lats - strength',
  '1. Sit down on a pull-down machine with a wide bar attached to the top pulley. Make sure that you adjust the knee pad of the machine to fit your height. These pads will prevent your body from being raised by the resistance attached to the bar.
2. Grab the bar with the palms facing forward using the prescribed grip. Note on grips: For a wide grip, your hands need to be spaced out at a distance wider than your shoulder width. For a medium grip, your hands need to be spaced out at a distance equal to your shoulder width and for a close grip at a distance smaller than your shoulder width.
3. As you have both arms extended in front of you holding the bar at the chosen grip width, bring your torso and head forward. Think of an imaginary line from the center of the bar down to the back of your neck. This is your starting position.
4. As you breathe out, bring the bar down until it touches the back of your neck by drawing the shoulders and the upper arms down and back. Tip: Concentrate on squeezing the back muscles once you reach the full contracted position. The upper torso should remain stationary and only the arms should move. The forearms should do no other work except for holding the bar; therefore do not try to pull down the bar using the forearms.
5. After a second on the contracted position squeezing your shoulder blades together, slowly raise the bar back to the starting position when your arms are fully extended and the lats are fully stretched. Inhale during this portion of the movement.
6. Repeat this motion for the prescribed amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Wide-Grip Rear Pull-Up',
  'lats - strength',
  '1. Grab the pull-up bar with the palms facing forward using a wide grip.
2. As you have both arms extended in front of you holding the bar, bring your torso forward and head so that there is an imaginary line from the pull-up bar to the back of your neck. This is your starting position.
3. Pull your torso up until the bar is near the back of your neck. To do this, draw the shoulders and upper arms down and back while slightly leaning your head forward. Exhale as you perform this portion of the movement. Tip: Concentrate on squeezing the back muscles once you reach the full contracted position. The upper torso should remain stationary as it moves through space and only the arms should move. The forearms should do no other work other than hold the bar.
4. After a second on the contracted position, start to inhale and slowly lower your torso back to the starting position when your arms are fully extended and the lats are fully stretched.
5. Repeat this motion for the prescribed amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Wide-Grip Standing Barbell Curl',
  'biceps - strength',
  '1. Stand up with your torso upright while holding a barbell at the wide outer handle. The palm of your hands should be facing forward. The elbows should be close to the torso. This will be your starting position.
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
  'Wide Stance Barbell Squat',
  'quadriceps - strength',
  '1. This exercise is best performed inside a squat rack for safety purposes. To begin, first set the bar on a rack that best matches your height. Once the correct height is chosen and the bar is loaded, step under the bar and place the back of your shoulders (slightly below the neck) across it.
2. Hold on to the bar using both arms at each side and lift it off the rack by first pushing with your legs and at the same time straightening your torso.
3. Step away from the rack and position your legs using a wider-than-shoulder-width stance with the toes slightly pointed out. Keep your head up at all times as looking down will get you off balance, and also maintain a straight back. This will be your starting position.
4. Begin to slowly lower the bar by bending the knees as you maintain a straight posture with the head up. Continue down until the angle between the upper leg and the calves becomes slightly less than 90-degrees (which is the point in which the upper legs are below parallel to the floor). Inhale as you perform this portion of the movement. Tip: If you performed the exercise correctly, the front of the knees should make an imaginary straight line with the toes that is perpendicular to the front. If your knees are past that imaginary line (if they are past your toes) then you are placing undue stress on the knee and the exercise has been performed incorrectly.
5. Begin to raise the bar as you exhale by pushing the floor with the heel of your foot as you straighten the legs again and go back to the starting position.
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
  'Wide Stance Stiff Legs',
  'hamstrings - olympic weightlifting',
  '1. Begin with a barbell loaded on the floor. Adopt a wide stance, and then bend at the hips to grab the bar. Your hips should be as far back as possible, and your legs nearly straight. Keep your back straight, and your head and chest up. This will be your starting position.
2. Begin the movement be engaging the hips, driving them forward as you allow the arms to hang straight. Continue until you are standing straight up, and then slowly return the weight to the starting position. For successive reps, the weight need not touch the floor.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Wind Sprints',
  'abdominals - strength',
  '1. Hang from a pull-up bar using a pronated grip. Your arms and legs should be extended. This will be your starting position.
2. Begin by quickly raising one knee as high as you can. Do not swing your body or your legs. 3
3. Immediately reverse the motion, returning that leg to the starting position. Simultaneously raise the opposite knee as high as possible.
4. Continue alternating between legs until the set is complete.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Windmills',
  'abductors - stretching',
  '1. Lie on your back with your arms extended out to the sides and your legs straight. This will be your starting position.
2. Lift one leg and quickly cross it over your body, attempting to touch the ground near the opposite hand.
3. Return to the starting position, and repeat with the opposite leg. Continue to alternate for 10-20 repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'World''s Greatest Stretch',
  'hamstrings - stretching',
  '1. This is a three-part stretch. Begin by lunging forward, with your front foot flat on the ground and on the toes of your back foot. With your knees bent, squat down until your knee is almost touching the ground. Keep your torso erect, and hold this position for 10-20 seconds.
2. Now, place the arm on the same side as your front leg on the ground, with the elbow next to the foot. Your other hand should be placed on the ground, parallel to your lead leg, to help support you during this portion of the stretch.
3. After 10-20 seconds, place your hands on either side of your front foot. Raise the toes of the front foot off of the ground, and straighten your leg. You may need to reposition your rear leg to do so. Hold for 10-20 seconds, and then repeat the entire sequence for the other side.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Wrist Circles',
  'forearms - stretching',
  '1. Start by standing straight with your feet being shoulder width apart from each other. Elevate your arms to the side of you until they are fully extended and parallel to the floor at a height that is evenly aligned with your shoulders. Tip: Your torso and arms should form the letter "T: Your palms should be facing down. This is the starting position.
2. Keeping your entire body stationary except for the wrists, begin to rotate both wrists forward in a circular motion. Tip: Pretend that you are trying to draw circles by using your hands as the brush. Breathe normally as you perform this exercise.
3. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Antebraço' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Wrist Roller',
  'forearms - strength',
  '1. To begin, stand straight up grabbing a wrist roller using a pronated grip (palms facing down). Your feet should be shoulder width apart.
2. Slowly lift both arms until they are fully extended and parallel to the floor in front of you. Note: Make sure the rope is not wrapped around the roller. Your entire body should be stationary except for the forearms. This is the starting position.
3. Rotate one wrist at a time in an upward motion to bring the weight up to the bar by rolling the rope around the roller.
4. Once the weight has reached the bar, slowly begin to lower the weight back down by rotating the wrist in a downward motion until the weight reaches the starting position.
5. Repeat for the prescribed amount of repetitions in your program.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Antebraço' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Wrist Rotations with Straight Bar',
  'forearms - strength',
  '1. Hold a barbell with both hands and your palms facing down; hands spaced about shoulder width. This will be your starting position.
2. Alternating between each of your hands, perform the movement by extending the wrist as though you were rolling up a newspaper. Continue alternating back and forth until failure.
3. Reverse the motion by flexing the wrist, rolling the opposite direction. Continue the alternating motion until failure.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Antebraço' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Yoke Walk',
  'quadriceps - strongman',
  '1. The yoke is usually done with a yoke apparatus, but is sometimes seen with refrigerators or other heavy objects.
2. Begin by racking the apparatus across the back of the shoulders. With your head looking forward and back arched, lift the yoke by driving through the heels.
3. Begin walking as quickly as possible using short, quick steps. You may hold the side posts of the yoke to help steady it and hold it in position. Continue for the given distance as fast as possible, usually 75-100 feet.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Zercher Squats',
  'quadriceps - strength',
  '1. This exercise is best performed inside a squat rack for safety purposes. To begin, first set the bar on a rack that best matches your height. The correct height should be anywhere above the waist but below the chest. Once the correct height is chosen and the bar is loaded, lock your hands together and place the bar on top of your arms in between the forearm and upper arm.
2. Lift the bar up so that it is resting on top of your forearms. If you are holding the bar properly, it should look as if you have your arms crossed but with a bar running across them.
3. Step away from the rack and position your legs using a shoulder width medium stance with the toes slightly pointed out. Keep your head up at all times as looking down will get you off balance and also maintain a straight back. This will be your starting position. (Note: For the purposes of this discussion we will use the medium stance described above which targets overall development; however you can choose any of the three stances discussed in the foot stances section).
4. Begin to lower the bar by bending the knees as you maintain a straight posture with the head up. Continue down until the angle between the upper leg and the calves becomes slightly less than 90-degrees (which is the point in which the upper legs are below parallel to the floor). Inhale as you perform this portion of the movement. Tip: If you performed the exercise correctly, the front of the knees should make an imaginary straight line with the toes that is perpendicular to the front. If your knees are past that imaginary line (if they are past your toes) then you are placing undue stress on the knee and the exercise has been performed incorrectly.
5. Begin to raise the bar as you exhale by pushing the floor with the ball of your foot mainly as you straighten the legs again and go back to the starting position.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Zottman Curl',
  'biceps - strength',
  '1. Stand up with your torso upright and a dumbbell in each hand being held at arms length. The elbows should be close to the torso.
2. Make sure the palms of the hands are facing each other. This will be your starting position.
3. While holding the upper arm stationary, curl the weights while contracting the biceps as you breathe out. Only the forearms should move. Your wrist should rotate so that you have a supinated (palms up) grip. Continue the movement until your biceps are fully contracted and the dumbbells are at shoulder level.
4. Hold the contracted position for a second as you squeeze the biceps.
5. Now during the contracted position, rotate your wrist until you now have a pronated (palms facing down) grip with the thumb at a higher position than the pinky.
6. Slowly begin to bring the dumbbells back down using the pronated grip.
7. As the dumbbells close your thighs, start rotating the wrist so that you go back to a neutral (palms facing your body) grip.
8. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Zottman Preacher Curl',
  'biceps - strength',
  '1. Grab a dumbbell in each hand and place your upper arms on top of the preacher bench or the incline bench. The dumbbells should be held at shoulder height and the elbows should be flexed. Hold the dumbbells with the palms of your hands facing down. This will be your starting position.
2. As you breathe in, slowly lower the dumbbells keeping the palms down until your upper arm is extended and your biceps are fully stretched.
3. Now rotate your wrists once you are at the bottom of the movement so that the palms of the hands are facing up.
4. As you exhale, use your biceps to curl the weights up until they are fully contracted and the dumbbells are at shoulder height. Again, remember that to ensure full contraction you need to bring that small finger higher than the thumb.
5. Squeeze the biceps hard for a second at the contracted position and rotate your wrists so that the palms are facing down again.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
