-- =============================================================================
-- ACADEMIA APP - PARTE 7/12: Exercícios 441-660 de 873
-- =============================================================================
-- Cole no SQL Editor do Supabase e clique em RUN.
-- Idempotente (use IF NOT EXISTS / ON CONFLICT).
-- =============================================================================

INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Lying Crossover',
  'abductors - stretching',
  '1. Lie on your back with your legs extended.
2. Cross one leg over your body with the knee bent, attempting to touch the knee to the ground. Your partner should kneel beside you, holding your shoulder down with one hand and controlling the crossed leg with the other. this will be your starting position.
3. Attempt to raise the bent knee off of the ground as your partner prevents any actual movement.
4. After 10-20 seconds, relax the leg as your partner gently presses the knee towards the floor. Repeat with the other side.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'advanced',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Lying Dumbbell Tricep Extension',
  'triceps - strength',
  '1. Lie on a flat bench while holding two dumbbells directly in front of you. Your arms should be fully extended at a 90-degree angle from your torso and the floor. The palms should be facing in and the elbows should be tucked in. This is the starting position.
2. As you breathe in and you keep the upper arms stationary with the elbows in, slowly lower the weight until the dumbbells are near your ears.
3. At that point, while keeping the elbows in and the upper arms stationary, use the triceps to bring the weight back up to the starting position as you breathe out.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Lying Face Down Plate Neck Resistance',
  'neck - strength',
  '1. Lie face down with your whole body straight on a flat bench while holding a weight plate behind your head. Tip: You will need to position yourself so that your shoulders are slightly above the end of a flat bench in order for the upper chest, neck and face to be off the bench. This will be your starting position.
2. While keeping the plate secure on the back of your head slowly lower your head (as in saying "yes") as you breathe in.
3. Raise your head back up to the starting position in a semi-circular motion as you breathe out. Hold the contraction for a second.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Trapézio' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Lying Face Up Plate Neck Resistance',
  'neck - strength',
  '1. Lie face up with your whole body straight on a flat bench while holding a weight plate on top of your forehead. Tip: You will need to position yourself so that your shoulders are slightly above the end of a flat bench in order for the traps, neck and head to be off the bench. This will be your starting position.
2. While keeping the plate secure on your forehead slowly lower your head back in a semi-circular motion as you breathe in.
3. Raise your head back up to the starting position in a semi-circular motion as you breathe out. Hold the contraction for a second.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Trapézio' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Lying Glute',
  'glutes - stretching',
  '1. Lie on your back with your partner kneeling beside you.
2. Flex the hip of one leg, raising it off of the floor. Rotate the leg so the foot is over the opposite hip, the lower leg perpendicular to your body. Your partner should hold the knee and ankle in place. This will be your starting position.
3. Attempt to push your leg towards your partner, who should be preventing any actual movement of the leg.
4. After 10-20 seconds, completely relax as your partner gently pushes the ankle and knee towards your chest. Be sure to inform your helper when the stretch is adequate to prevent injury or overstretching.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'advanced',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Lying Hamstring',
  'hamstrings - stretching',
  '1. Lie on your back with your legs extended. Your partner should be kneeling beside you. Raise one leg up towards the ceiling and have your partner hold the ankle. Your partner can use their shoulder to brace your leg if necessary. This will be your starting position.
2. With your partner holding your leg in place, attempt to flex the knee, contracting the hamstrings for 10-20 seconds.
3. Then relax your leg, allowing your partner to gently push the leg towards your head. Be sure to inform your helper when the stretch is adequate to prevent injury or overstretching. Switch sides once complete.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'advanced',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Lying High Bench Barbell Curl',
  'biceps - strength',
  '1. Lie face forward on a tall flat bench while holding a barbell with a supinated grip (palms facing up). Tip: If you are holding a barbell grab it using a shoulder-width grip and if you are using an E-Z Bar grab it on the inner handles. Your upper body should be positioned in a way that the upper chest is over the end of the bench and the barbell is hanging in front of you with the arms extended and perpendicular to the floor. This will be your starting position.
2. While keeping the elbows in and the upper arms stationary, curl the weight up in a semi-circular motion as you contract the biceps and exhale. Hold at the top of the movement for a second.
3. As you inhale, slowly go back to the starting position. Tip: Maintain full control of the weight at all times and avoid any swinging. Remember, only the forearms should move throughout the movement.
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
  'Lying Leg Curls',
  'hamstrings - strength',
  '1. Adjust the machine lever to fit your height and lie face down on the leg curl machine with the pad of the lever on the back of your legs (just a few inches under the calves). Tip: Preferably use a leg curl machine that is angled as opposed to flat since an angled position is more favorable for hamstrings recruitment.
2. Keeping the torso flat on the bench, ensure your legs are fully stretched and grab the side handles of the machine. Position your toes straight (or you can also use any of the other two stances described on the foot positioning section). This will be your starting position.
3. As you exhale, curl your legs up as far as possible without lifting the upper legs from the pad. Once you hit the fully contracted position, hold it for a second.
4. As you inhale, bring the legs back to the initial position. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Lying Machine Squat',
  'quadriceps - strength',
  '1. Adjust the leg machine to a height that will allow you to get inside it with your knees bent and the thighs slightly below parallel.
2. Once you select the weight, position yourself inside the machine face up with the knees bent and thighs slightly below parallel to the platform. Make sure that the knees do not go past the toes. The angle created between the hamstrings and the calves should be one that is slightly less than 90 degrees (since your starting position requires you to start slightly below parallel). Your back and your head should be resting on the machine while your shoulders are pressed under the shoulder pads.
3. Place your hands by the handles and position your feet slightly pointing out at a shoulder width position. This will be your starting position.
4. While pressing with the balls of the feet as you breathe out, make your whole body erect as you squeeze the quads. Hold the contracted position for a second. Tip: Since you are starting below parallel, you can opt to use your hands to help you up by pressing on your thighs only on the first repetition.
5. Slowly squat down as you inhale but instead of going all the way down to the starting position, just stop once your thighs are parallel to the platform. The angle between your hamstrings and calves should be a 90-degree angle.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Lying One-Arm Lateral Raise',
  'shoulders - strength',
  '1. While holding a dumbbell in one hand, lay with your chest down on a flat bench. The other hand can be used to hold to the leg of the bench for stability.
2. Position the palm of the hand that is holding the dumbbell in a neutral manner (palms facing your torso) as you keep the arm extended with the elbow slightly bent. This will be your starting position.
3. Now raise the arm with the dumbbell to the side until your elbow is at shoulder height and your arm is roughly parallel to the floor as you exhale. Tip: Maintain your arm perpendicular to the torso while keeping your arm extended throughout the movement. Also, keep the contraction at the top for a second.
4. Slowly lower the dumbbell to the starting position as you inhale.
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
  'Lying Prone Quadriceps',
  'quadriceps - stretching',
  '1. Lay face down on the floor with your partner kneeling beside you. Flex one knee and raise that leg off the ground, attempting to touch your glutes with your foot. Your partner should hold the knee and ankle. This will be your starting position.
2. Attempt to extend your knee while your partner prevents any actual movement.
3. After 10-20 seconds, relax your muscles as your partner gently pushes the foot towards your glutes, further stretching the quadriceps and hip flexors.
4. After 10-20 seconds, switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'advanced',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Lying Rear Delt Raise',
  'shoulders - strength',
  '1. While holding a dumbbell in each hand, lay with your chest down on a flat bench.
2. Position the palms of the hands in a neutral manner (palms facing your torso) as you keep the arms extended with the elbows slightly bent. This will be your starting position.
3. Now raise the arms to the side until your elbows are at shoulder height and your arms are roughly parallel to the floor as you exhale. Tip: Maintain your arms perpendicular to the torso while keeping them extended throughout the movement. Also, keep the contraction at the top for a second.
4. Slowly lower the dumbbells to the starting position as you inhale.
5. Repeat for the recommended amount of repetitions and then switch to the other arm.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Lying Supine Dumbbell Curl',
  'biceps - strength',
  '1. Lie down on a flat bench face up while holding a dumbbell in each arm on top of your thighs.
2. Bring the dumbbells to the sides with the arms extended and the palms of the hands facing your thighs (neutral grip).
3. While keeping the arms close to your torso and elbows in, slowly lower your arms (as you keep them extended with a slight bend at the elbows) as far down towards the floor as you can go. Once you cannot go down any further, lock your upper arms in that position and that will be your starting position.
4. As you breathe out, slowly begin to curl the weights up as you simultaneously rotate your wrists so that the palms of the hands face up. Continue curling the weight until your biceps are fully contracted and squeeze hard at the top position for a second. Tip: Only the forearms should move. Upper arms should remain stationary and elbows should stay in throughout the movement.
5. Return back to the starting position very slowly.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Lying T-Bar Row',
  'middle back - strength',
  '1. Load up the T-bar Row Machine with the desired weight and adjust the leg height so that your upper chest is at the top of the pad. Tip: In some machines all you can do is stand on the appropriate step that allows you to be at a height that has the upper chest at the top of the pad.
2. Lay face down on the pad and grab the handles. You can either use a palms down, palms up, or palms in position depending on what part of your back you want to emphasize.
3. Lift the bar off the rack and extend your arms in front of you. This will be your starting position.
4. As you exhale slowly pull the weight up and squeeze your back at the top of the movement. Tip: Keep the upper arms as close to the torso as possible throughout the movement in order to better engage the back muscles. Also, do not lift your body off of the pad at any time and refrain from using the biceps to lift the weight.
5. After a second contraction at the top of the movement, as you inhale, slowly go back down to the starting position.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Lying Triceps Press',
  'triceps - strength',
  '1. Lie on a flat bench with either an e-z bar (my preference) or a straight bar placed on the floor behind your head and your feet on the floor.
2. Grab the bar behind you, using a medium overhand (pronated) grip, and raise the bar in front of you at arms length. Tip: The arms should be perpendicular to the torso and the floor. The elbows should be tucked in. This is the starting position.
3. As you breathe in, slowly lower the weight until the bar lightly touches your forehead while keeping the upper arms and elbows stationary.
4. At that point, use the triceps to bring the weight back up to the starting position as you breathe out.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Machine Bench Press',
  'chest - strength',
  '1. Sit down on the Chest Press Machine and select the weight.
2. Step on the lever provided by the machine since it will help you to bring the handles forward so that you can grab the handles and fully extend the arms.
3. Grab the handles with a palms-down grip and lift your elbows so that your upper arms are parallel to the floor to the sides of your torso. Tip: Your forearms will be pointing forward since you are grabbing the handles. Once you bring the handles forward and extend the arms you will be at the starting position.
4. Now bring the handles back towards you as you breathe in.
5. Push the handles away from you as you flex your pecs and you breathe out. Hold the contraction for a second before going back to the starting position.
6. Repeat for the recommended amount of reps.
7. When finished step on the lever again and slowly get the handles back to their original place.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Machine Bicep Curl',
  'biceps - strength',
  '1. Adjust the seat to the appropriate height and make your weight selection. Place your upper arms against the pads and grasp the handles. This will be your starting position.
2. Perform the movement by flexing the elbow, pulling your lower arm towards your upper arm.
3. Pause at the top of the movement, and then slowly return the weight to the starting position.
4. Avoid returning the weight all the way to the stops until the set is complete to keep tension on the muscles being worked.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Machine Preacher Curls',
  'biceps - strength',
  '1. Sit down on the Preacher Curl Machine and select the weight.
2. Place the back of your upper arms (your triceps) on the preacher pad provided and grab the handles using an underhand grip (palms facing up). Tip: Make sure that when you place the arms on the pad you keep the elbows in. This will be your starting position.
3. Now lift the handles as you exhale and you contract the biceps. At the top of the position make sure that you hold the contraction for a second. Tip: Only the forearms should move. The upper arms should remain stationary and on the pad at all times.
4. Lower the handles slowly back to the starting position as you inhale.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Machine Shoulder (Military) Press',
  'shoulders - strength',
  '1. Sit down on the Shoulder Press Machine and select the weight.
2. Grab the handles to your sides as you keep the elbows bent and in line with your torso. This will be your starting position.
3. Now lift the handles as you exhale and you extend the arms fully. At the top of the position make sure that you hold the contraction for a second.
4. Lower the handles slowly back to the starting position as you inhale.
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
  'Machine Triceps Extension',
  'triceps - strength',
  '1. Adjust the seat to the appropriate height and make your weight selection. Place your upper arms against the pads and grasp the handles. This will be your starting position.
2. Perform the movement by extending the elbow, pulling your lower arm away from your upper arm.
3. Pause at the completion of the movement, and then slowly return the weight to the starting position.
4. Avoid returning the weight all the way to the stops until the set is complete to keep tension on the muscles being worked.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Medicine Ball Chest Pass',
  'chest - plyometrics',
  '1. You will need a partner for this exercise. Lacking one, this movement can be performed against a wall.
2. Begin facing your partner holding the medicine ball at your torso with both hands.
3. Pull the ball to your chest, and reverse the motion by extending through the elbows. For sports applications, you can take a step as you throw.
4. Your partner should catch the ball, and throw it back to you.
5. Receive the throw with both hands at chest height.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Medicine Ball Full Twist',
  'abdominals - plyometrics',
  '1. For this exercise you will need a medicine ball and a partner. Stand back to back with your partner, spaced 2-3 feet apart. This will be your starting position.
2. Hold the ball in front of the trunk. Open the hips and turn the shoulders at the same time as your partner.
3. For full rotation, you and your partner should twist in the same direction, i.e. counter-clockwise.
4. Pass the ball to your partner, and both of you can now twist in the opposite direction to repeat the procedure.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Medicine Ball Scoop Throw',
  'shoulders - plyometrics',
  '1. Assume a semisquat stance with a medicine ball in your hands. Your arms should hang so the ball is near your feet.
2. Begin by thrusting the hips forward as you extend through the legs, jumping up.
3. As you do, swing your arms up and over your head, keeping them extended, releasing the ball at the peak of your movement. The goal is to throw the ball the greatest distance behind you.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Middle Back Shrug',
  'middle back - strength',
  '1. Lie facedown on an incline bench while holding a dumbbell in each hand. Your arms should be fully extended hanging down and pointing towards the floor. The palms of your hands should be facing each other. This will be your starting position.
2. As you exhale, squeeze your shoulder blades together and hold the contraction for a full second. Tip: This movement is just like the reverse action of a hug, or trying to perform rear laterals as if you had no arms.
3. As you inhale go back to the starting position.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Middle Back Stretch',
  'middle back - stretching',
  '1. Stand so your feet are shoulder width apart and your hands are on your hips.
2. Twist at your waist until you feel a stretch. Hold for 10 to 15 seconds, then twist to the other side.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Mixed Grip Chin',
  'middle back - strength',
  '1. Using a spacing that is just about 1 inch wider than shoulder width, grab a pull-up bar with the palms of one hand facing forward and the palms of the other hand facing towards you. This will be your starting position.
2. Now start to pull yourself up as you exhale. Tip: With the arm that has the palms facing up concentrate on using the back muscles in order to perform the movement. The elbow of that arm should remain close to the torso. With the other arm that has the palms facing forward, the elbows will be away but in line with the torso. You will concentrate on using the lats to pull your body up.
3. After a second contraction at the top, start to slowly come down as you inhale.
4. Repeat for the recommended amount of repetitions.
5. On the following set, switch grips; so if you had the right hand with the palms facing you and the left one with the palms facing forward, on the next set you will have the palms facing forward for the right hand and facing you for the left.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Monster Walk',
  'abductors - strength',
  '1. Place a band around both ankles and another around both knees. There should be enough tension that they are tight when your feet are shoulder width apart.
2. To begin, take short steps forward alternating your left and right foot.
3. After several steps, do just the opposite and walk backward to where you started.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Elástico/Banda' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Mountain Climbers',
  'quadriceps - plyometrics',
  '1. Begin in a pushup position, with your weight supported by your hands and toes. Flexing the knee and hip, bring one leg until the knee is approximately under the hip. This will be your starting position.
2. Explosively reverse the positions of your legs, extending the bent leg until the leg is straight and supported by the toe, and bringing the other foot up with the hip and knee flexed. Repeat in an alternating fashion for 20-30 seconds.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Moving Claw Series',
  'hamstrings - plyometrics',
  '1. This move helps prepare your running form to help you excel at sprinting. As you run, be sure to flex the knee, aiming to kick your glutes as the hip extends.
2. Reload the quad as the leg moves back forward, attacking the ground on the next step.
3. Ensure that as you run, you block with the arms, punching through in a rapid 1-2 motion.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Muscle Snatch',
  'hamstrings - olympic weightlifting',
  '1. Begin with a loaded barbell held at the mid thigh position with a wide grip. The feet should be directly below the hips, with the feet turned out as needed. Lower the hips, with the chest up and the head looking forward. The shoulders should be just in front of the bar. This will be the starting position.
2. Begin the pull by driving through the front of the heels, raising the bar. Transition into the second pull by extending through the hips knees and ankles, driving the bar up as quickly as possible. The bar should be close to the body.
3. Continue raising the bar to the overhead position, without rebending the knees.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Muscle Up',
  'lats - strength',
  '1. Grip the rings using a false grip, with the base of your palms on top of the rings. Initiate a pull up by pulling the elbows down to your side, flexing the elbows.
2. As you reach the top position of the pull-up, pull the rings to your armpits as you roll your shoulders forward, allowing your elbows to move straight back behind you. This puts you into the proper position to continue into the dip portion of the movement.
3. Maintaining control and stability, extend through the elbow to complete the motion.
4. Use care when lowering yourself to the ground.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Narrow Stance Hack Squats',
  'quadriceps - strength',
  '1. Place the back of your torso against the back pad of the machine and hook your shoulders under the shoulder pads provided.
2. Position your legs in the platform using a less than shoulder width narrow stance with the toes slightly pointed out. Your feet should be around 3 inches or less apart. Tip: Keep your head up at all times and also maintain the back on the pad at all times.
3. Place your arms on the side handles of the machine and disengage the safety bars (which on most designs is done by moving the side handles from a facing front position to a diagonal position).
4. Now straighten your legs without locking the knees. This will be your starting position.
5. Begin to slowly lower the unit by bending the knees as you maintain a straight posture with the head up (back on the pad at all times). Continue down until the angle between the upper leg and the calves becomes slightly less than 90-degrees (which is the point in which the upper legs are below parallel to the floor). Inhale as you perform this portion of the movement.
6. Begin to raise the unit as you exhale by pushing the floor with mainly with the heels of your feet as you straighten the legs again and go back to the starting position.
7. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Narrow Stance Leg Press',
  'quadriceps - strength',
  '1. Using a leg press machine, sit down on the machine and place your legs on the platform directly in front of you at a less-than-shoulder-width narrow stance with the toes slightly pointed out. Your feet should be around 3 inches or less apart. Tip: Keep your head up at all times and also maintain the back on the pad at all times.
2. Lower the safety bars holding the weighted platform in place and press the platform all the way up until your legs are fully extended in front of you. Tip: Make sure that you do not lock your knees. Your torso and the legs should make a perfect 90-degree angle. This will be your starting position.
3. As you inhale, slowly lower the platform until your upper and lower legs make a 90-degree angle.
4. Pushing mainly with the heels of your feet and using the quadriceps go back to the starting position as you exhale.
5. Repeat for the recommended amount of repetitions and ensure to lock the safety pins properly once you are done. You do not want that platform falling on you fully loaded.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Narrow Stance Squats',
  'quadriceps - strength',
  '1. This exercise is best performed inside a squat rack for safety purposes. To begin, first set the bar on a rack that best matches your height. Once the correct height is chosen and the bar is loaded, step under the bar and place the back of your shoulders (slightly below the neck) across it.
2. Hold on to the bar using both arms at each side and lift it off the rack by first pushing with your legs and at the same time straightening your torso.
3. Step away from the rack and position your legs using a less-than-shoulder-width narrow stance with the toes slightly pointed out. Feet should be around 3-6 inches apart. Keep your head up at all times (looking down will get you off balance) and maintain a straight back. This will be your starting position. (Note: For the purposes of this discussion we will use the medium stance described above which targets overall development; however you can choose any of the three stances discussed in the foot stances section).
4. Begin to slowly lower the bar by bending the knees as you maintain a straight posture with the head up. Continue down until the angle between the upper leg and the calves becomes slightly less than 90-degrees (which is the point in which the upper legs are below parallel to the floor). Inhale as you perform this portion of the movement. Tip: If you performed the exercise correctly, the front of the knees should make an imaginary straight line with the toes that is perpendicular to the front. If your knees are past that imaginary line (if they are past your toes) then you are placing undue stress on the knee and the exercise has been performed incorrectly.
5. Begin to raise the bar as you exhale by pushing the floor with the heel of your foot mainly as you straighten the legs again and go back to the starting position.
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
  'Natural Glute Ham Raise',
  'hamstrings - strength',
  '1. Using the leg pad of a lat pulldown machine or a preacher bench, position yourself so that your ankles are under the pads, knees on the seat, and you are facing away from the machine. You should be upright and maintaining good posture.
2. This will be your starting position. Lower yourself under control until your knees are almost completely straight.
3. Remaining in control, raise yourself back up to the starting position.
4. If you are unable to complete a rep, use a band, a partner, or push off of a box to aid in completing a repetition.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Neck-SMR',
  'neck - stretching',
  '1. Using a muscle roller or a rolling pin, place the roller behind your head and against your neck. Make sure that you do not place the roller directly against the spine, but turned slightly so that the roller is pressed against the muscles to either side of the spine. This will be your starting position.
2. Starting at the top of your neck, slowly roll down the muscles of your neck, pausing at points of tension for 10-30 seconds.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Trapézio' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Neck Press',
  'chest - strength',
  '1. Lie back on a flat bench. Using a medium-width grip (a grip that creates a 90-degree angle in the middle of the movement between the forearms and the upper arms), lift the bar from the rack and hold it straight over your neck with your arms locked. This will be your starting position.
2. As you breathe in, come down slowly until you feel the bar on your neck.
3. After a second pause, bring the bar back to the starting position as you breathe out and push the bar using your chest muscles. Lock your arms and squeeze your chest in the contracted position, hold for a second and then start coming down slowly again. Tip: It should take at least twice as long to go down than to come up).
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
  'Oblique Crunches',
  'abdominals - strength',
  '1. Lie flat on the floor with your lower back pressed to the ground. For this exercise, you will need to put one hand beside your head and the other to the side against the floor.
2. Make sure your feet are elevated and resting on a flat surface.
3. Now lift the shoulder in which your hand is touching your head.
4. Simply elevate your shoulder and body upward until you touch your knee. For example, if you have your right hand besides your head, then you want to elevate your body upwards until your right elbow touches your left knee. The same variation can be applied doing the inverse and using your left elbow to touch your right knee.
5. After your knee touches your elbow, lower your body until you have reached the starting position.
6. Remember to breathe in during the eccentric (lowering) part of the exercise and to breathe out during the concentric (upward) part of the exercise.
7. Continue alternating in this manner until all of the recommended repetitions for each side have been completed.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Oblique Crunches - On The Floor',
  'abdominals - strength',
  '1. Start out by lying on your right side with your legs lying on top of each other. Make sure your knees are bent a little bit.
2. Place your left hand behind your head.
3. Once you are in this set position, begin by moving your left elbow up as you would perform a normal crunch except this time the main emphasis is on your obliques.
4. Crunch as high as you can, hold the contraction for a second and then slowly drop back down into the starting position.
5. Remember to breathe in during the eccentric (lowering) part of the exercise and to breathe out during the concentric (elevation) part of the exercise.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Olympic Squat',
  'quadriceps - olympic weightlifting',
  '1. Begin with a barbell supported on top of the traps. The chest should be up, and the head facing forward. Adopt a hip width stance with the feet turned out as needed.
2. Descend by flexing the knees, refraining from moving the hips back as much as possible. This requires that the knees travel forward; ensure that they stay aligned with the feet. The goal is to keep the torso as upright as possible. Continue all the way down, keeping the weight on the front of the heel.
3. At the moment the upper legs contact the lower, reverse the motion, driving the weight upward.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'On-Your-Back Quad Stretch',
  'quadriceps - stretching',
  '1. Lie on a flat bench or step, and hang one leg and arm over the side.
2. Bend the knee and hold the top of the foot. As you do this, be careful not to arch your lower back.
3. Pull the belly button to the spine to stay in neutral. Press your foot down and into your hand. To add the hip stretch, lift the hip of the leg you''re holding up toward the ceiling.
4. Switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'On Your Side Quad Stretch',
  'quadriceps - stretching',
  '1. Start off by lying on your right side, with your right knee bent at a 90-degree angle resting on the floor in front of you (this stabilizes the torso).
2. Bend your left knee behind you and hold your left foot with your left hand. To stretch your hip flexor, press your left hip forward as you push your left foot back into your hand. Switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One-Arm Dumbbell Row',
  'middle back - strength',
  '1. Choose a flat bench and place a dumbbell on each side of it.
2. Place the right leg on top of the end of the bench, bend your torso forward from the waist until your upper body is parallel to the floor, and place your right hand on the other end of the bench for support.
3. Use the left hand to pick up the dumbbell on the floor and hold the weight while keeping your lower back straight. The palm of the hand should be facing your torso. This will be your starting position.
4. Pull the resistance straight up to the side of your chest, keeping your upper arm close to your side and keeping the torso stationary. Breathe out as you perform this step. Tip: Concentrate on squeezing the back muscles once you reach the full contracted position. Also, make sure that the force is performed with the back muscles and not the arms. Finally, the upper torso should remain stationary and only the arms should move. The forearms should do no other work except for holding the dumbbell; therefore do not try to pull the dumbbell up using the forearms.
5. Lower the resistance straight down to the starting position. Breathe in as you perform this step.
6. Repeat the movement for the specified amount of repetitions.
7. Switch sides and repeat again with the other arm.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One-Arm Flat Bench Dumbbell Flye',
  'chest - strength',
  '1. Lie down on a flat bench with a dumbbell in one hand resting on top of your thigh. The palm of your hand with the dumbbell in it should be at a neutral grip.
2. By using your thighs to help you get the dumbbell up, clean the dumbbell so that you can hold it in front of you with your lifting arm being fully extended. Remember to maintain a neutral grip with this exercise. Your non lifting hand should be to the side holding the flat bench for better support. This will be your starting position.
3. Your arm with the weight should have a slight bend on your elbow in order to prevent stress at the biceps tendon. Begin by lowering your arm with the weight in it out in a wide arc until you feel a stretch on your chest. Breathe in as you perform this portion of the movement. Tip: Keep in mind that throughout the movement, your lifting arm should remain stationary; the movement should only occur at the shoulder joint.
4. Return your lifting arm back to the starting position as you squeeze your chest muscles and breathe out. Tip: Make sure to use the same arc of motion used to lower the weights.
5. Hold for a second at the contracted position and repeat the movement for the prescribed amount of repetitions.
6. Switch arms and repeat the exercise.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One-Arm High-Pulley Cable Side Bends',
  'abdominals - strength',
  '1. Connect a standard handle to a tower. Move cable to highest pulley position.
2. Stand with side to cable. With one hand, reach up and grab handle with underhand grip.
3. Pull down cable until elbow touches your side and the handle is by your shoulder.
4. Position feet hip-width apart. Place free hand on hip to help gauge pivot point.
5. Keep arm in static position. Contract oblique to bring the weight down in a side crunch.
6. Once you reach maximum contraction, slowly release the weight to the starting position. The weight stack should never be unloaded in a resting position. The aim is constant tension during the set.
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
  'One-Arm Incline Lateral Raise',
  'shoulders - strength',
  '1. Lie down sideways on an incline bench press with a dumbbell in the hand. Make sure the shoulder is pressing against the incline bench and the arm is lying across your body with the palm around your navel.
2. Hold a dumbbell in your uppermost arm while keeping it extended in front of you parallel to the floor. This is your starting position.
3. While keeping the dumbbell parallel to the floor at all times, perform a lateral raise. Your arm should travel straight up until it is pointing at the ceiling. Tip: Exhale as you perform this movement. Hold the dumbbell in the position and feel the contraction in the shoulders for a second.
4. While inhaling lower the weight across your body back into the starting position.
5. Repeat the movement for the prescribed amount of repetitions.
6. Switch arms and repeat the movement.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One-Arm Kettlebell Clean',
  'hamstrings - strength',
  '1. Place a kettlebell between your feet. As you bend down to grab the kettlebell, push your butt back and keep your eyes looking forward.
2. Clean the kettlebell to your shoulders by extending through the legs and hips as you raise the kettlebell towards your shoulder. The wrist should rotate as you do so.
3. Return the weight to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One-Arm Kettlebell Clean and Jerk',
  'shoulders - strength',
  '1. Hold a kettlebell by the handle.
2. Clean the kettlebell to your shoulder by extending through the legs and hips as you pull the kettlebell towards your shoulder. Rotate your wrist as you do so, so that the palm faces forward.
3. Dip your body by bending the knees, keeping your torso upright.
4. Immediately reverse direction, driving through the heels, in essence jumping to create momentum. As you do so, press the kettlebell overhead to lockout by extending the arms, using your body''s momentum to move the weight.
5. Receive the weight overhead by returning to a squat position underneath the weight.
6. Keeping the weight overhead, return to a standing position. Lower the weight to the floor to perform the next repetition.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One-Arm Kettlebell Floor Press',
  'chest - strength',
  '1. Lie on the floor holding a kettlebell with one hand, with your upper arm supported by the floor. The palm should be facing in.
2. Press the kettlebell straight up toward the ceiling, rotating your wrist.
3. Lower the kettlebell back to the starting position and repeat.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One-Arm Kettlebell Jerk',
  'shoulders - strength',
  '1. Hold a kettlebell by the handle. Clean the kettlebell to your shoulder by extending through the legs and hips as you pull the kettlebell towards your shoulder. Rotate your wrist as you do so, so that the palm faces forward. This will be your starting position.
2. Dip your body by bending the knees, keeping your torso upright.
3. Immediately reverse direction, driving through the heels, in essence jumping to create momentum. As you do so, press the kettlebell overhead to lockout by extending the arms, using your body''s momentum to move the weight. Receive the weight overhead by returning to a squat position underneath the weight. Keeping the weight overhead, return to a standing position.
4. Lower the weight to perform the next repetition.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One-Arm Kettlebell Military Press To The Side',
  'shoulders - strength',
  '1. Clean a kettlebell to your shoulder. Clean the kettlebell to your shoulder by extending through the legs and hips as you pull the kettlebell towards your shoulder. Rotate your wrist as you do so, so that the palm faces inward. This will be your starting position.
2. Look at the kettlebell and press it up and out until it is locked out overhead.
3. Lower the kettlebell back to your shoulder under control and repeat. Make sure to contract your lat, butt, and stomach forcefully for added stability and strength.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One-Arm Kettlebell Para Press',
  'shoulders - strength',
  '1. Clean a kettlebell to your shoulder. Clean the kettlebell to your shoulder by extending through the legs and hips as you pull the kettlebell towards your shoulder. Rotate your wrist as you do so, so that the palm faces forward. This will be your starting position.
2. Hold the kettlebell with the elbow out to the side, and press it up and out until it is locked out overhead.
3. Lower the kettlebell back to your shoulder under control and repeat. Make sure to contract your lat, butt, and stomach forcefully for added stability and strength.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One-Arm Kettlebell Push Press',
  'shoulders - strength',
  '1. Hold a kettlebell by the handle. Clean the kettlebell to your shoulder by extending through the legs and hips as you pull the kettlebell towards your shoulder. Rotate your wrist as you do so, so that the palm faces forward. This will be your starting position.
2. Dip your body by bending the knees, keeping your torso upright.
3. Immediately reverse direction, driving through the heels, in essence jumping to create momentum. As you do so, press the kettlebell overhead to lockout by extending the arms, using your body''s momentum to move the weight. Lower the weight to perform the next repetition.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One-Arm Kettlebell Row',
  'middle back - strength',
  '1. Place a kettlebell in front of your feet. Bend your knees slightly and then push your butt out as much as possible as you bend over to get in the starting position. Grab the kettlebell and pull it to your stomach, retracting your shoulder blade and flexing the elbow. Keep your back straight. Lower and repeat.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One-Arm Kettlebell Snatch',
  'shoulders - strength',
  '1. Place a kettlebell between your feet. Bend your knees and push your butt back to get in the proper starting position.
2. Look straight ahead and swing the kettlebell back between your legs.
3. Immediately reverse the direction and drive through with your hips and knees, accelerating the kettlebell upward. As the kettlebell rises to your shoulder rotate your hand and punch straight up, using momentum to receive the weight locked out overhead.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One-Arm Kettlebell Split Jerk',
  'shoulders - strength',
  '1. Hold a kettlebell by the handle. Clean the kettlebell to your shoulder by extending through the legs and hips as you pull the kettlebell towards your shoulder. Rotate your wrist as you do so, so that the palm faces forward. This will be your starting position.
2. Dip your body by bending the knees, keeping your torso upright.
3. Immediately reverse direction, driving through the heels, in essence jumping to create momentum. As you do so, press the kettlebell overhead to lockout by extending the arms, using your body''s momentum to move the weight.
4. Receive the weight overhead by returning to a squat position underneath the weight, positioning one leg in front of you and one leg behind you.
5. Keeping the weight overhead, return to a standing position and bring your feet together. Lower the weight to perform the next repetition.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One-Arm Kettlebell Split Snatch',
  'shoulders - strength',
  '1. Hold a kettlebell in one hand by the handle.
2. Squat towards the floor, and then reverse the motion, extending the hips, knees, and finally the ankles, to raise the kettlebell overhead.
3. After fully extending the body, descend into a lunge position to receive the weights overhead, one leg forward and one leg back. Ensure you drive through with your hips and lock the ketttlebells overhead in one uninterrupted motion.
4. Return to a standing position, holding the weight overhead, and bring the feet together. Lower the weight to return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One-Arm Kettlebell Swings',
  'hamstrings - strength',
  '',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One-Arm Long Bar Row',
  'middle back - strength',
  '1. Position a bar into a landmine or in a corner to keep it from moving. Load an appropriate weight onto your end.
2. Stand next to the bar, and take a grip with one hand close to the collar. Using your hips and legs, rise to a standing position.
3. Assume a bent-knee stance with your hips back and your chest up. Your arm should be extended. This will be your starting position.
4. Pull the weight to your side by retracting the shoulder and flexing the elbow. Do not jerk the weight or cheat during the movement.
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
  'One-Arm Medicine Ball Slam',
  'abdominals - strength',
  '1. Start in a standing position with a staggered, athletic stance. Hold a medicine ball in one hand, on the same side as your back leg. This will be your starting position.
2. Begin by winding the arm, raising the medicine ball above your head. As you do so, extend through the hips, knees, and ankles to load up for the slam.
3. At peak extension, flex the shoulders, spine, and hips to throw the ball hard into the ground directly in front of you.
4. Catch the ball on the bounce and continue for the desired number of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One-Arm Open Palm Kettlebell Clean',
  'hamstrings - strength',
  '1. Place one kettlebell between your feet.
2. Grab the handle with one hand and raise the kettlebell rapidly, let it flip so that the ball of the kettlebell lands in the palm of your hand.
3. Throw the kettlebell out in front of you and catch the handle with one hand.
4. Take the kettlebell to the floor and repeat. Make sure to work both arms.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One-Arm Overhead Kettlebell Squats',
  'quadriceps - strength',
  '1. Clean and press a kettlebell with one arm. Clean the kettlebell to your shoulder by extending through the legs and hips as you pull the kettlebell towards your shoulder. Rotate your wrist as you do so. Press the weight overhead by extending through the elbow.This will be your starting position.
2. Looking straight ahead and keeping a kettlebell locked out above you, flex the knees and hips and lower your torso between your legs, keeping your head and chest up.
3. Pause at the bottom position for a second before rising back to the top, driving through the heels of your feet.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One-Arm Side Deadlift',
  'quadriceps - strength',
  '1. Stand to the side of a barbell next to its center. Bend your knees and lower your body until you are able to reach the barbell.
2. Grasp the bar as if you were grabbing a briefcase (palms facing you since the bar is sideways). You may need a wrist wrap if you are using a significant amount of weight. This is your starting position.
3. Use your legs to help lift the barbell up while exhaling. Your arms should extend fully as bring the barbell up until you are in a standing position.
4. Slowly bring the barbell back down while inhaling. Tip: Make sure to bend your knees while lowering the weight to avoid any injury from occurring.
5. Repeat for the recommended amount of repetitions.
6. Switch arms and repeat the movement.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One-Arm Side Laterals',
  'shoulders - strength',
  '1. Pick a dumbbell and place it in one of your hands. Your non lifting hand should be used to grab something steady such as an incline bench press. Lean towards your lifting arm and away from the hand that is gripping the incline bench as this will allow you to keep your balance.
2. Stand with a straight torso and have the dumbbell by your side at arm''s length with the palm of the hand facing you. This will be your starting position.
3. While maintaining the torso stationary (no swinging), lift the dumbbell to your side with a slight bend on the elbow and your hand slightly tilted forward as if pouring water in a glass. Continue to go up until you arm is parallel to the floor. Exhale as you execute this movement and pause for a second at the top.
4. Lower the dumbbell back down slowly to the starting position as you inhale.
5. Repeat for the recommended amount of repetitions.
6. Switch arms and repeat the exercise.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One-Legged Cable Kickback',
  'glutes - strength',
  '1. Hook a leather ankle cuff to a low cable pulley and then attach the cuff to your ankle.
2. Face the weight stack from a distance of about two feet, grasping the steel frame for support.
3. While keeping your knees and hips bent slightly and your abs tight, contract your glutes to slowly "kick" the working leg back in a semicircular arc as high as it will comfortably go as you breathe out. Tip: At full extension, squeeze your glutes for a second in order to achieve a peak contraction.
4. Now slowly bring your working leg forward, resisting the pull of the cable until you reach the starting position.
5. Repeat for the recommended amount of repetitions.
6. Switch legs and repeat the movement for the other side.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One Arm Against Wall',
  'lats - stretching',
  '1. From a standing position, place a bent arm against a wall or doorway.
2. Slowly lean toward your arm until you feel a stretch in your lats.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One Arm Chin-Up',
  'middle back - strength',
  '1. For this exercise, start out by placing a towel around a chin up bar.
2. Grab the chin-up bar with your palm facing you. One hand will be grabbing the chin-up bar and the other will be grabbing the towel.
3. Bring your torso back around 30 degrees or so while creating a curvature on your lower back and sticking your chest out. This is your starting position.v
4. Pull your torso up until the bar touches your upper chest by drawing the shoulders and the upper arms down and back. Exhale as you perform this portion of the movement. Tip: Concentrate on squeezing the back muscles once you reach the full contracted position. The upper torso should remain stationary as it moves through space and only the arms should move. The forearms should do no other work other than hold the bar.
5. After a second on the contracted position, start to inhale and slowly lower your torso back to the starting position when your arms are fully extended and the lats are fully stretched.
6. Repeat this motion for the prescribed amount of repetitions.
7. Switch arms and repeat the movement.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One Arm Dumbbell Bench Press',
  'chest - strength',
  '1. Lie down on a flat bench with a dumbbell in one hand on top of your thigh.
2. By using your thigh to help you get the dumbbell up, clean the dumbbell up so that you can hold it in front of you at shoulder width. Use the hand you are not lifting with to help position the dumbbell over you properly.
3. Once at shoulder width, rotate your wrist forward so that the palm of your hand is facing away from you. This will be your starting position.
4. Bring down the weights slowly to your side as you breathe in. Keep full control of the dumbbell at all times. Tip: Use the hand that you are not lifting with to help keep the dumbbell balance as you may struggle a bit at first. Only use your non-lifting hand if it is needed. Otherwise, keep it resting to the side.
5. As you breathe out, push the dumbbells up using your pectoral muscles. Lock your arms in the contracted position, squeeze your chest, hold for a second and then start coming down slowly. Tip: It should take at least twice as long to go down than to come up.
6. Repeat the movement for the prescribed amount of repetitions of your training program.
7. Switch arms and repeat the movement.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One Arm Dumbbell Preacher Curl',
  'biceps - strength',
  '1. Grab a dumbbell with the right arm and place the upper arm on top of the preacher bench or the incline bench. The dumbbell should be held at shoulder length. This will be your starting position.
2. As you breathe in, slowly lower the dumbbell until your upper arm is extended and the biceps is fully stretched.
3. As you exhale, use the biceps to curl the weight up until your biceps is fully contracted and the dumbbell is at shoulder height. Again, remember that to ensure full contraction you need to bring that small finger higher than the thumb.
4. Squeeze the biceps hard for a second at the contracted position and repeat for the recommended amount of repetitions.
5. Switch arms and repeat the movement.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One Arm Floor Press',
  'triceps - strength',
  '1. Lie down on a flat surface with your back pressing against the floor or an exercise mat. Make sure your knees are bent.
2. Have a partner hand you the bar on one hand. When starting, your arm should be just about fully extended, similar to the starting position of a barbell bench press. However, this time your grip will be neutral (palms facing your torso).
3. Make sure the hand you are not using to lift the weight is placed by your side.
4. Begin the exercise by lowering the barbell until your elbow touches the ground. Make sure to breathe in as this is the eccentric (lowering part of the exercise).
5. Then start lifting the barbell back up to the original starting position. Remember to breathe out during the concentric (lifting part of the exercise).
6. Repeat until you have performed your recommended repetitions.
7. Switch arms and repeat the movement.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One Arm Lat Pulldown',
  'lats - strength',
  '1. Select an appropriate weight and adjust the knee pad to help keep you down. Grasp the handle with a pronated grip. This will be your starting position.
2. Pull the handle down, squeezing your elbow to your side as you flex the elbow.
3. Pause at the bottom of the motion, and then slowly return the handle to the starting position.
4. For multiple repetitions, avoid completely returning the weight to keep tension on the muscles being worked.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One Arm Pronated Dumbbell Triceps Extension',
  'triceps - strength',
  '1. Lie flat on a bench while holding a dumbbell at arms length. Your arm should be perpendicular to your body. The palm of your hand should be facing towards your feet as a pronated grip is required to perform this exercise.
2. Place your non lifting hand on your bicep for support.
3. Slowly begin to lower the dumbbell down as you breathe in.
4. Then, begin lifting the dumbbell upward as you contract the triceps. Remember to breathe out during the concentric (lifting part of the exercise).
5. Repeat until you have performed your set repetitions.
6. Switch arms and repeat the movement.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One Arm Supinated Dumbbell Triceps Extension',
  'triceps - strength',
  '1. Lie flat on a bench while holding a dumbbell at arms length. Your arm should be perpendicular to your body. The palm of your hand should be facing towards your face as a supinated grip is required to perform this exercise.
2. Place your non lifting hand on your bicep for support.
3. Slowly begin to lower the dumbbell down as you breathe in.
4. Then, begin lifting the dumbbell upward as you contract the triceps. Remember to breathe out during the concentric (lifting part of the exercise).
5. Repeat until you have performed your set repetitions.
6. Switch arms and repeat the movement.
7. Switch arms again and repeat the movement.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One Half Locust',
  'quadriceps - stretching',
  '1. Lie facedown on the floor.
2. Put your left hand under your left hipbone to pad your hip and pubic bone.
3. Bend your right knee so you can hold the foot in your right hand.
4. Lift the foot in the air and simultaneously lift your shoulders off the floor. This also stretches the right hip flexor and the chest and shoulders. Switch sides. If it doesn''t bother your back, you can try it with both arms and legs at the same time.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One Handed Hang',
  'lats - stretching',
  '1. Grab onto a chinup bar with one hand, using a pronated grip. Keep your feet on the floor or a step. Allow the majority of your weight to hang from that hand, while keeping your feet on the ground. Hold for 10-20 seconds and switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One Knee To Chest',
  'glutes - stretching',
  '1. Start off by lying on the floor.
2. Extend one leg straight and pull the other knee to your chest. Hold under the knee joint to protect the kneecap.
3. Gently tug that knee toward your nose.
4. Switch sides. This stretches the buttocks and lower back of the bent leg and the hip flexor of the straight leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'One Leg Barbell Squat',
  'quadriceps - strength',
  '1. Start by standing about 2 to 3 feet in front of a flat bench with your back facing the bench. Have a barbell in front of you on the floor. Tip: Your feet should be shoulder width apart from each other.
2. Bend the knees and use a pronated grip with your hands being wider than shoulder width apart from each other to lift the barbell up until you can rest it on your chest.
3. Then lift the barbell over your head and rest it on the base of your neck. Move one foot back so that your toe is resting on the flat bench. Your other foot should be stationary in front of you. Keep your head up at all times as looking down will get you off balance and also maintain a straight back. Tip: Make sure your back is straight and chest is out while performing this exercise.
4. As you inhale, slowly lower your leg until your thigh is parallel to the floor. At this point, your knee should be over your toes. Your chest should be directly above the middle of your thigh.
5. Leading with the chest and hips and contracting the quadriceps, elevate your leg back to the starting position as you exhale.
6. Repeat for the recommended amount of repetitions.
7. Switch legs and repeat the movement.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Open Palm Kettlebell Clean',
  'hamstrings - strength',
  '1. Place one kettlebell between your feet. Clean the kettlebell by extending through the legs and hips as you raise the kettlebell towards your shoulders.
2. Release the kettlebell as it comes up, and let it flip so that the ball of the kettlebell lands in the palms of your hands.
3. Release the kettlebell out in front of you and catch the handle with both hands. Lower the kettlebell to the starting position and repeat.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Otis-Up',
  'abdominals - strength',
  '1. Secure your feet and lay back on the floor. Your knees should be bent. Hold a weight with both hands to your chest. This will be your starting position.
2. Initiate the movement by flexing the hips and spine to raise your torso up from the ground.
3. As you move up, press the weight up so that it is above your head at the top of the movement.
4. Return the weight to your chest as you reverse the sit-up motion, ensuring not to go all the way down to the floor.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Overhead Cable Curl',
  'biceps - strength',
  '1. To begin, set a weight that is comfortable on each side of the pulley machine. Note: Make sure that the amount of weight selected is the same on each side.
2. Now adjust the height of the pulleys on each side and make sure that they are positioned at a height higher than that of your shoulders.
3. Stand in the middle of both sides and use an underhand grip (palms facing towards the ceiling) to grab each handle. Your arms should be fully extended and parallel to the floor with your feet positioned shoulder width apart from each other. Your body should be evenly aligned the handles. This is the starting position.
4. While exhaling, slowly squeeze the biceps on each side until your forearms and biceps touch.
5. While inhaling, move your forearms back to the starting position. Note: Your entire body is stationary during this exercise except for the forearms.
6. Repeat for the recommended amount of repetitions prescribed in your program.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Overhead Lat',
  'lats - stretching',
  '1. Sit upright on the floor with your partner behind you. Raise one arm straight up, and flex the elbow, attempting to touch your hand to your back. Your parner should hold your tricep and wrist. This will be your starting position.
2. Attempt to pull your upper arm to your side as your partner prevents you from doing actually doing so.
3. After 10-20 seconds, relax the arm and allow your partner to further stretch the lat by applying gentle pressure to the tricep. Hold for 10-20 seconds, and then switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'advanced',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Overhead Slam',
  'lats - plyometrics',
  '1. Hold a medine ball with both hands and stand with your feet at shoulder width. This will be your starting position.
2. Initiate the countermovement by raising the ball above your head and fully extending your body.
3. Reverse the motion, slamming the ball into the ground directly in front of you as hard as you can.
4. Receive the ball with both hands on the bounce and repeat the movement.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Overhead Squat',
  'quadriceps - olympic weightlifting',
  '1. Start out by having a barbell in front of you on the floor. Your feet should be wider than shoulder width apart from each other.
2. Bend the knees and use a pronated grip (palms facing you) to grab the barbell. Your hands should be at a wider than shoulder width apart from each other before lifting. Once you are positioned, lift the barbell up until you can rest it on your chest.
3. Move the barbell over and slightly behind your head and make sure your arms are fully extended. Keep your head up at all times and also maintain a straight back. Retract your shoulder blades. This is your starting position.
4. Slowly lower the weight by bending your knees until your thighs are parallel to the ground while inhaling. Tip: Keep your back straight while performing this exercise to avoid any injuries and your arms should remain extended and over your head at all times.
5. Now use your feet and legs to help bring the weight back up to the starting position while exhaling.
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
  'Overhead Stretch',
  'abdominals - stretching',
  '1. Standing straight up, lace your fingers together and open your palms to the ceiling. Keep your shoulders down as you extend your arms up.
2. To create a full torso stretch, pull your tailbone down and stabilize your torso as you do this. Stretch the muscles on both the front and the back of the torso.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Overhead Triceps',
  'triceps - stretching',
  '1. Sit upright on the floor with your partner behind you. Raise one arm straight up, and flex the elbow, attempting to touch your hand to your back. Your parner should hold your elbow and wrist. This will be your starting position.
2. Attempt to extend the arm straight into the air as your partner prevents you from doing actually doing so.
3. After 10-20 seconds, relax the arm and allow your partner to further stretch the tricep by applying gentle pressure to the wrist. Hold for 10-20 seconds, and then switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'advanced',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Pallof Press',
  'abdominals - strength',
  '1. Connect a standard handle to a tower, and—if possible—position the cable to shoulder height. If not, a low pulley will suffice.
2. With your side to the cable, grab the handle with both hands and step away from the tower. You should be approximately arm''s length away from the pulley, with the tension of the weight on the cable.
3. With your feet positioned hip-width apart and knees slightly bent, hold the cable to the middle of your chest. This will be your starting position.
4. Press the cable away from your chest, fully extending both arms. You core should be tight and engaged.
5. Hold the repetition for several seconds before returning to the starting position.
6. At the conclusion of the set, repeat facing the other direction.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Pallof Press With Rotation',
  'abdominals - strength',
  '1. Connect a standard handle to a tower, and position the cable to shoulder height.
2. With your side to the cable, grab the handle with one hand and step away from the tower. You should be approximately arm''s length away from the pulley, with the tension of the weight on the cable. Align outstretched arm with cable.
3. With your feet positioned hip-width apart, pull the cable into your chest and grab the handle with your other hand. Both hands should be on the handle at this time.
4. Facing forward, press the cable away from your chest. You core should be tight and engaged.
5. Keeping your hips straight, twist your torso away from the pulley until you get a full quarter rotation.
6. Maintain your rigid stance and straight arms. Return to the neutral position in a slow and controlled manner. Your arms should be extended in front of you.
7. With the side tension still engaging your core, bring your hands to your chest and immediately press outward to a fully extended position. This constitutes one rep.
8. Repeat to failure.
9. Then, reposition and repeat the same series of movements on the opposite side.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Palms-Down Dumbbell Wrist Curl Over A Bench',
  'forearms - strength',
  '1. Start out by placing two dumbbells on one side of a flat bench.
2. Kneel down on both of your knees so that your body is facing the flat bench.
3. Use your arms to grab both of the dumbbells with a pronated grip (palms facing down) and bring them up so that your forearms are resting against the flat bench. Your wrists should be hanging over the edge.
4. Start out by curling your wrist upwards and exhaling.
5. Slowly lower your wrists back down to the starting position while inhaling.
6. Your forearms should be stationary as your wrist is the only movement needed to perform this exercise.
7. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Antebraço' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Palms-Down Wrist Curl Over A Bench',
  'forearms - strength',
  '1. Start out by placing a barbell on one side of a flat bench.
2. Kneel down on both of your knees so that your body is facing the flat bench.
3. Use your arms to grab the barbell with a pronated grip (palms down) and bring them up so that your forearms are resting against the flat bench. Your wrists should be hanging over the edge.
4. Start out by curling your wrist upwards and exhaling.
5. Slowly lower your wrists back down to the starting position while inhaling.
6. Your forearms should be stationary as your wrist is the only movement needed to perform this exercise.
7. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Antebraço' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Palms-Up Barbell Wrist Curl Over A Bench',
  'forearms - strength',
  '1. Start out by placing a barbell on one side of a flat bench.
2. Kneel down on both of your knees so that your body is facing the flat bench.
3. Use your arms to grab the barbell with a supinated grip (palms up) and bring them up so that your forearms are resting against the flat bench. Your wrists should be hanging over the edge.
4. Start out by curling your wrist upwards and exhaling.
5. Slowly lower your wrists back down to the starting position while inhaling.
6. Your forearms should be stationary as your wrist is the only movement needed to perform this exercise.
7. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Antebraço' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Palms-Up Dumbbell Wrist Curl Over A Bench',
  'forearms - strength',
  '1. Start out by placing two dumbbells on one side of a flat bench.
2. Kneel down on both of your knees so that your body is facing the flat bench.
3. Use your arms to grab both of the dumbbells with a supinated grip (palms up) and bring them up so that your forearms are resting against the flat bench. Your wrists should be hanging over the edge.
4. Start out by curling your wrist upwards and exhaling.
5. Slowly lower your wrists back down to the starting position while inhaling. Make sure to inhale during this part of the exercise.
6. Your forearms should be stationary as your wrist is the only movement needed to perform this exercise.
7. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Antebraço' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Parallel Bar Dip',
  'triceps - strength',
  '1. Stand between a set of parallel bars. Place a hand on each bar, and then take a small jump to help you get into the starting position with your arms locked out.
2. Begin by flexing the elbow, lowering your body until your arms break 90 degrees. Avoid swinging, and maintain good posture throughout the descent.
3. Reverse the motion by extending the elbow, pushing yourself back up into the starting position.
4. Repeat for the desired number of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Pelvic Tilt Into Bridge',
  'lower back - stretching',
  '1. Lie down with your feet on the floor, heels directly under your knees.
2. Lift only your tailbone to the ceiling to stretch your lower back. (Don''t lift the entire spine yet.) Pull in your stomach.
3. To go into a bridge, lift the entire spine except the neck.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Peroneals-SMR',
  'calves - stretching',
  '1. Lay on your side, supporting your weight on your forearm and on a foam roller placed on the outside of your lower leg. Your upper leg can either be on top of your lower leg, or you can cross it in front of you. This will be your starting position.
2. Raise your hips off of the ground and begin to roll from below the knee to above the ankle on the side of your leg, pausing at points of tension for 10-30 seconds. Repeat on the other leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Panturrilha' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Rolo de Espuma' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Peroneals Stretch',
  'calves - stretching',
  '1. In a seated position, loop a belt, rope, or band around one foot. This will be your starting position.
2. With the leg extended and the heel off of the ground, pull on the belt so that the foot is inverted, with the inside of the foot being pulled towards you. Hold for 10-20 seconds, and then switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Panturrilha' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Physioball Hip Bridge',
  'glutes - strength',
  '1. Lay on a ball so that your upper back is on the ball with your hips unsupported. Both feet should be flat on the floor, hip width apart or wider. This will be your starting position.
2. Begin by extending the hips using your glutes and hamstrings, raising your hips upward as you bridge.
3. Pause at the top of the motion and return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Pin Presses',
  'triceps - powerlifting',
  '1. Pin presses remove the eccentric phase of the bench press, developing starting strength. They also allow you to train a desired range of motion.
2. The bench should be set up in a power rack. Set the pins to the desired point in your range of motion, whether it just be lockout or an inch off of your chest. The bar should be moved to the pins and prepared for lifting.
3. Begin by lying on the bench, with the bar directly above the contact point during your regular bench. Tuck your feet underneath you and arch your back. Using the bar to help support your weight, lift your shoulder off the bench and retract them, squeezing the shoulder blades together. Use your feet to drive your traps into the bench. Maintain this tight body position throughout the movement.
4. You can take a standard bench grip, or shoulder width to focus on the triceps. The bar, wrist, and elbow should stay in line at all times. Focus on squeezing the bar and trying to pull it apart.
5. Drive the bar up with as much force as possible. The elbows should be tucked in until lockout.
6. Return the bar to the pins, pausing before beginning the next repetition.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Piriformis-SMR',
  'glutes - stretching',
  '1. Sit with your buttocks on top of a foam roll. Bend your knees, and then cross one leg so that the ankle is over the knee. This will be your starting position.
2. Shift your weight to the side of the crossed leg, rolling over the buttocks until you feel tension in your upper glute. You may assist the stretch by using one hand to pull the bent knee towards your chest. Hold this position for 10-30 seconds, and then switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Rolo de Espuma' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Prancha',
  'abdominals - strength',
  '1. Get into a prone position on the floor, supporting your weight on your toes and your forearms. Your arms are bent and directly below the shoulder.
2. Keep your body straight at all times, and hold this position as long as possible. To increase difficulty, an arm or leg can be raised.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Plate Pinch',
  'forearms - strength',
  '1. Grab two wide-rimmed plates and put them together with the smooth sides facing outward
2. Use your fingers to grip the outside part of the plate and your thumb for the other side thus holding both plates together. This is the starting position.
3. Squeeze the plate with your fingers and thumb. Hold this position for as long as you can.
4. Repeat for the recommended amount of sets prescribed in your program.
5. Switch arms and repeat the movements.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Antebraço' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Plate Twist',
  'abdominals - strength',
  '1. Lie down on the floor or an exercise mat with your legs fully extended and your upper body upright. Grab the plate by its sides with both hands out in front of your abdominals with your arms slightly bent.
2. Slowly cross your legs near your ankles and lift them up off the ground. Your knees should also be bent slightly. Note: Move your upper body back slightly to help keep you balanced turning this exercise. This is the starting position.
3. Move the plate to the left side and touch the floor with it. Breathe out as you perform that movement.
4. Come back to the starting position as you breathe in and then repeat the movement but this time to the right side of the body. Tip: Use a slow controlled movement at all times. Jerking motions can injure the back.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Platform Hamstring Slides',
  'hamstrings - strength',
  '1. For this movement a wooden floor or similar is needed. Lay on your back with your legs extended. Place a gym towel or a light weight underneath your heel. This will be your starting position.
2. Begin the movement by flexing the knee, keeping your other leg straight.
3. Continue bringing the heel closer to you, sliding it on the floor.
4. At full knee flexion, reverse the movement to return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Plie Dumbbell Squat',
  'quadriceps - strength',
  '1. Hold a dumbbell at the base with both hands and stand straight up. Move your legs so that they are wider than shoulder width apart from each other with your knees slightly bent.
2. Your toes should be facing out. Note: Your arms should be stationary while performing the exercise. This is the starting position.
3. Slowly bend the knees and lower your legs until your thighs are parallel to the floor. Make sure to inhale as this is the eccentric part of the exercise.
4. Press mainly with the heel of the foot to bring the body back to the starting position while exhaling.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Plyo Kettlebell Pushups',
  'chest - strength',
  '1. Place a kettlebell on the floor. Place yourself in a pushup position, on your toes with one hand on the ground and one hand holding the kettlebell, with your elbows extended. This will be your starting position.
2. Begin by lowering yourself as low as you can, keeping your back straight.
3. Quickly and forcefully reverse direction, pushing yourself up to the other side of the kettlebell, switching hands as you do so. Continue the movement by descending and repeating the movement back and forth.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Plyo Push-up',
  'chest - plyometrics',
  '1. Move into a prone position on the floor, supporting your weight on your hands and toes.
2. Your arms should be fully extended with the hands around shoulder width. Keep your body straight throughout the movement. This will be your starting position.
3. Descend by flexing at the elbow, lowering your chest towards the ground.
4. At the bottom, reverse the motion by pushing yourself up through elbow extension as quickly as possible. Attempt to push your upper body up until your hands leave the ground.
5. Return to the starting position and repeat the exercise.
6. For added difficulty, add claps into the movement while you are air borne.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Posterior Tibialis Stretch',
  'calves - stretching',
  '1. In a seated position, loop a belt, rope, or band around one foot. This will be your starting position.
2. With the leg extended and the heel off of the ground, pull on the belt so that the foot is everted, with the outside of the foot being pulled towards you. Hold for 10-20 seconds, and then switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Panturrilha' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Power Clean',
  'hamstrings - strength',
  '1. Stand with your feet slightly wider than shoulder width apart and toes pointing out slightly.
2. Squat down and grasp bar with a closed, pronated grip. Your hands should be slightly wider than shoulder width apart outside knees with elbows fully extended.
3. Place the bar about 1 inch in front of your shins and over the balls of your feet.
4. Your back should be flat or slightly arched, your chest held up and out and your shoulder blades should be retracted.
5. Keep your head in a neutral position (in line with vertebral column and not tilted or rotated) with your eyes focused straight ahead. Inhale during this phase.
6. Lift the bar from the floor by forcefully extending the hips and the knees as you exhale. Tip: The upper torso should maintain the same angle. Do not bend at the waist yet and do not let the hips rise before the shoulders (this would have the effect of pushing the glutes in the air and stretching the hamstrings.
7. Keep elbows fully extended with the head in a neutral position and the shoulders over the bar.
8. As the bar raises keep it as close to the shins as possible.
9. As the bar passes the knees, thrust your hips forward and slightly bend the knees to avoid locking them. Tip: At this point your thighs should be against the bar.
10. Keep the back flat or slightly arched, elbows fully extended and your head neutral. Tip: You will hold your breath until the next phase.
11. Inhale and then forcefully and quickly extend your hips and knees and stand on your toes.
12. Keep the bar as close to your body as possible. Tip: Your back should be flat with the elbows pointed out to the sides and your head in a neutral position. Also, keep your shoulders over the bar and arms straight as long as possible.
13. When your lower body joints are fully extended, shrug the shoulders upward rapidly without letting the elbows flex yet. Exhale during this portion of the movement.
14. As the shoulders reach their highest elevation flex your elbows to begin pulling your body under the bar.
15. Continue to pull the arms as high and as long as possible. Tip: Due to the explosive nature of this phase, your torso will be erect or with an arched back, your head will be tilted back slightly and your feet may lose contact with the floor.
16. After the lower body has fully extended and the bar reaches near maximal height, pull your body under the bar and rotate the arms around and under the bar.
17. Simultaneously, flex the hips and knees into a quarter squat position.
18. Once the arms are under the bar, inhale and then lift your elbows to position the upper arms parallel to the floor. Rack the bar across the front of your collar bones and front shoulder muscles.
19. Catch the bar with an erect and tight torso, a neutral head position and flat feet. Exhale during this movement.
20. Stand up by extending the hips and knees to a fully erect position.
21. Lower the bar by gradually reducing the muscular tension of the arms to allow a controlled descent of the bar to the thighs. Inhale during this movement.
22. Simultaneously flex the hips and knees to cushion the impact of the bar on the thighs.
23. Squat down with the elbows fully extended until the bar touches the floor.
24. Start over at Phase 1 and repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Power Clean from Blocks',
  'hamstrings - olympic weightlifting',
  '1. With a barbell on boxes of the desired height, take a grip just outside the legs. Lower your hips with the weight focused on the heels, back straight, head facing forward, chest up, with your shoulders just in front of the bar. This will be your starting position.
2. Begin the first pull by driving through the heels, extending your knees. Your back angle should stay the same, and your arms should remain straight. As the bar approaches the mid-thigh position, begin extending through the hips.
3. In a jumping motion, accelerate by extending the hips, knees, and ankles, using speed to move the bar upward. There should be no need to actively pull through the arms to accelerate the weight. At the end of the second pull, the body should be fully extended, leaning slightly back, with the arms still extended.
4. As full extension is achieved, transition into the third pull by aggressively shrugging and flexing the arms with the elbows up and out. At peak extension, pull yourself under the bar far enough that it can be racked onto the shoulders, rotating your elbows under the bar as you do so. The bar should be racked onto the protracted shoulders, lightly touching the throat with the hands relaxed.
5. Immediately recover by driving through the heels, keeping the torso upright and elbows up. Continue until you have risen to a standing position, and complete the repetition by returning the weight to the boxes.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Power Jerk',
  'quadriceps - olympic weightlifting',
  '1. Standing with the weight racked on the front of the shoulders, begin with the dip. With your feet directly under your hips, flex the knees without moving the hips backward. Go down only slightly, and reverse direction as powerfully as possible.
2. Drive through the heels create as much speed and force as possible, and be sure to move your head out of the way as the bar leaves the shoulders.
3. At this moment as the feet leave the floor, the feet must be placed into the receiving position as quickly as possible. In the brief moment the feet are not actively driving against the platform, the athletes effort to push the bar up will drive them down. The feet should be moved to a slightly wider stance, with the knees partially bent.
4. Receive the bar with the arms locked out overhead.
5. Return to a standing position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Power Partials',
  'shoulders - strength',
  '1. Stand up with your torso upright and a dumbbell on each hand being held at arms length. The elbows should be close to the torso.
2. The palms of the hands should be facing your torso. Your feet should be about shoulder width apart. This will be your starting position.
3. Keeping your arms straight and the torso stationary, lift the weights out to your sides until they are about shoulder level height while exhaling.
4. Feel the contraction for a second and begin to lower the weights back down to the starting position while inhaling. Tip: Keep the palms facing down with the little finger slightly higher while lifting and lowering the weights as it will concentrate the stress on your shoulders mainly.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Power Snatch',
  'hamstrings - olympic weightlifting',
  '1. Begin with a loaded barbell on the floor. The bar should be close to or touching the shins, and a wide grip should be taken on the bar. The feet should be directly below the hips, with the feet turned out as needed. Lower the hips, with the chest up and the head looking forward. The shoulders should be just in front of the bar. This will be the starting position.
2. Begin the first pull by driving through the front of the heels, raising the bar from the ground. The back angle should stay the same until the bar passes the knees.
3. Transition into the second pull by extending through the hips knees and ankles, driving the bar up as quickly as possible. The bar should be close to the body. At peak extension, shrug the shoulders and allow the elbows to flex to the side.
4. As you move your feet into the receiving position, a slightly wider position, pull yourself below the bar as you elevate the bar overhead. The bar should be received in a partial squat. Continue raising the bar to the overhead position, receiving the bar locked out overhead.
5. Return to a standing position with the weight over head.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Power Snatch from Blocks',
  'quadriceps - olympic weightlifting',
  '1. Begin with a loaded barbell on boxes or stands of the desired height. A wide grip should be taken on the bar. The feet should be directly below the hips, with the feet turned out as needed. Lower the hips, with the chest up and the head looking forward. The shoulders should be just in front of the bar, with the elbows pointed out. This will be the starting position.
2. Begin the first pull by driving through the front of the heels, raising the bar from the boxes.
3. Transition into the second pull by extending through the hips knees and ankles, driving the bar up as quickly as possible. The bar should be close to the body. At peak extension, shrug the shoulders and allow the elbows to flex to the side.
4. As you move your feet into the receiving position, forcefully pull yourself below the bar as you elevate the bar overhead. The feet should move to just outside the hips, turned out as necessary. Receive the bar above a full squat and with the arms fully extended overhead.
5. Keeping the bar aligned over the front of the heels, your head and chest up, drive through heels of the feet to move to a standing position. Carefully return the weight to the boxes.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Power Stairs',
  'hamstrings - strongman',
  '1. In the power stairs, implements are moved up a staircase. For training purposes, these can be performed with a tire or box.
2. Begin by taking the implement with both hands. Set your feet wide, with your head and chest up. Drive through the ground with your heels, extending your knees and hips to raise the weight from the ground.
3. As you lean back, attempt to swing the weight onto the stairs, which are usually around 16-18" high. You can use your legs to help push the weight onto the stair.
4. Repeat for 3-5 repetitions, and continue with a heavier weight, moving as fast as possible.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Rosca Scott',
  'biceps - strength',
  '1. To perform this movement you will need a preacher bench and an E-Z bar. Grab the E-Z curl bar at the close inner handle (either have someone hand you the bar which is preferable or grab the bar from the front bar rest provided by most preacher benches). The palm of your hands should be facing forward and they should be slightly tilted inwards due to the shape of the bar.
2. With the upper arms positioned against the preacher bench pad and the chest against it, hold the E-Z Curl Bar at shoulder length. This will be your starting position.
3. As you breathe in, slowly lower the bar until your upper arm is extended and the biceps is fully stretched.
4. As you exhale, use the biceps to curl the weight up until your biceps is fully contracted and the bar is at shoulder height. Squeeze the biceps hard and hold this position for a second.
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
  'Preacher Hammer Dumbbell Curl',
  'biceps - strength',
  '1. Place the upper part of both arms on top of the preacher bench as you hold a dumbbell in each hand with the palms facing each other (neutral grip).
2. As you breathe in, slowly lower the dumbbells until your upper arm is extended and the biceps is fully stretched.
3. As you exhale, use the biceps to curl the weight up until your biceps is fully contracted and the dumbbells are at shoulder height.
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
  'Press Sit-Up',
  'abdominals - strength',
  '1. To begin, lie down on a bench with a barbell resting on your chest. Position your legs so they are secure on the extension of the abdominal bench. This is the starting position.
2. While inhaling, tighten your abdominals and glutes. Simultaneously curl your torso as you do when performing a sit-up and press the barbell to an overhead position while exhaling. Tip: Use your arms to push the barbell out as you perform this exercise while still focusing on the abdominal muscles.
3. Lower your upper body back down to the starting position while bringing the barbell back down to your torso. Remember to breathe in while lowering the body.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Prone Manual Hamstring',
  'hamstrings - strength',
  '1. You will need a partner for this exercise. Lay face down with your legs straight. Your assistant will place their hand on your heel.
2. To begin, flex the knee to curl your leg up. Your partner should provide resistance, starting light and increasing the pressure as the movement is completed. Communicate with your partner to monitor appropriate resistance levels.
3. Pause at the top, returning the leg to the starting position as your partner provides resistance going the other direction.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Prowler Sprint',
  'hamstrings - cardio',
  '1. Place your sled on an appropriate surface, loaded to a suitable weight. The sled should provide enough resistance to require effort, but not so heavy that you are significantly slowed down.
2. You may use the upright or the low handles for this exercise. Place your hands on the handles with your arms extended, leaning into the implement.
3. With good posture, drive through the ground with alternating, short steps. Move as fast as you can for a short distance.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'cardio',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Pull Through',
  'glutes - strength',
  '1. Begin standing a few feet in front of a low pulley with a rope or handle attached. Face away from the machine, straddling the cable, with your feet set wide apart.
2. Begin the movement by reaching through your legs as far as possible, bending at the hips. Keep your knees slightly bent. Keeping your arms straight, extend through the hip to stand straight up. Avoid pulling upward through the shoulders; all of the motion should originate through the hips.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Pullups',
  'lats - strength',
  '1. Grab the pull-up bar with the palms facing forward using the prescribed grip. Note on grips: For a wide grip, your hands need to be spaced out at a distance wider than your shoulder width. For a medium grip, your hands need to be spaced out at a distance equal to your shoulder width and for a close grip at a distance smaller than your shoulder width.
2. As you have both arms extended in front of you holding the bar at the chosen grip width, bring your torso back around 30 degrees or so while creating a curvature on your lower back and sticking your chest out. This is your starting position.
3. Pull your torso up until the bar touches your upper chest by drawing the shoulders and the upper arms down and back. Exhale as you perform this portion of the movement. Tip: Concentrate on squeezing the back muscles once you reach the full contracted position. The upper torso should remain stationary as it moves through space and only the arms should move. The forearms should do no other work other than hold the bar.
4. After a second on the contracted position, start to inhale and slowly lower your torso back to the starting position when your arms are fully extended and the lats are fully stretched.
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
  'Push-Up Wide',
  'chest - strength',
  '1. With your hands wide apart, support your body on your toes and hands in a plank position. Your elbows should be extended and your body straight. Do not allow your hips to sag. This will be your starting position.
2. To begin, allow the elbows to flex, lowering your chest to the floor as you inhale.
3. Using your pectoral muscles, press your upper body back up to the starting position by extending the elbows. Exhale as you perform this step.
4. After pausing at the contracted position, repeat the movement for the prescribed amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Push-Ups - Close Triceps Position',
  'triceps - strength',
  '1. Lie on the floor face down and place your hands closer than shoulder width for a close hand position. Make sure that you are holding your torso up at arms'' length.
2. Lower yourself until your chest almost touches the floor as you inhale.
3. Using your triceps and some of your pectoral muscles, press your upper body back up to the starting position and squeeze your chest. Breathe out as you perform this step.
4. After a second pause at the contracted position, repeat the movement for the prescribed amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Push-Ups With Feet Elevated',
  'chest - strength',
  '1. Lie on the floor face down and place your hands about 36 inches apart from each other holding your torso up at arms length.
2. Place your toes on top of a flat bench. This will allow your body to be elevated. Note: The higher the elevation of the flat bench, the higher the resistance of the exercise is.
3. Lower yourself until your chest almost touches the floor as you inhale.
4. Using your pectoral muscles, press your upper body back up to the starting position and squeeze your chest. Breathe out as you perform this step.
5. After a second pause at the contracted position, repeat the movement for the prescribed amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Push-Ups With Feet On An Exercise Ball',
  'chest - strength',
  '1. Lie on the floor face down and place your hands about 36 inches apart from each other holding your torso up at arms length.
2. Place your toes on top of an exercise ball. This will allow your body to be elevated.
3. Lower yourself until your chest almost touches the floor as you inhale.
4. Using your pectoral muscles, press your upper body back up to the starting position and squeeze your chest. Breathe out as you perform this step.
5. After a second pause at the contracted position, repeat the movement for the prescribed amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Push Press',
  'shoulders - olympic weightlifting',
  '',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Push Press - Behind the Neck',
  'shoulders - olympic weightlifting',
  '1. Standing with the weight racked on the back of the shoulders, begin with the dip. With your feet directly under your hips, flex the knees without moving the hips backward. Go down only slightly, and reverse direction as powerfully as possible. Drive through the heels create as much speed and force as possible, moving the bar in a vertical path.
2. Using the momentum generated, finish pressing the weight overhead be extending through the arms.
3. Return to the starting position, using your legs to absorb the impact.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Push Up to Side Plank',
  'chest - strength',
  '1. Get into pushup position on the toes with your hands just outside of shoulder width.
2. Perform a pushup by allowing the elbows to flex. As you descend, keep your body straight.
3. Do one pushup and as you come up, shift your weight on the left side of the body, twist to the side while bringing the right arm up towards the ceiling in a side plank.
4. Lower the arm back to the floor for another pushup and then twist to the other side.
5. Repeat the series, alternating each side, for 10 or more reps.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Pushups',
  'chest - strength',
  '1. Lie on the floor face down and place your hands about 36 inches apart while holding your torso up at arms length.
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
  'Pushups (Close and Wide Hand Positions)',
  'chest - strength',
  '1. Lie on the floor face down and body straight with your toes on the floor and the hands wider than shoulder width for a wide hand position and closer than shoulder width for a close hand position. Make sure you are holding your torso up at arms length.
2. Lower yourself until your chest almost touches the floor as you inhale.
3. Using your pectoral muscles, press your upper body back up to the starting position and squeeze your chest. Breathe out as you perform this step.
4. After a second pause at the contracted position, repeat the movement for the prescribed amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Pyramid',
  'lower back - stretching',
  '1. Start off by rolling your torso forward onto the ball so your hips rest on top of the ball and become the highest point of your body.
2. Rest your hands and feet on the floor. Your arms and legs can be slightly bent or straight, depending on the size of the ball, your flexibility, and the length of your limbs. This also helps develop stabilizing strength in your torso and shoulders.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Quad Stretch',
  'quadriceps - stretching',
  '1. Lay on your side. Loop a belt, rope, or band around your top foot. Flex the knee and extend your hip, attempting to touch your glutes with your foot, and holding the belt with your hands. This will be your starting position.
2. With the belt being held over the shoulder or overhead, gently pull to increase the stretch in the quadriceps. Hold for 10-20 seconds, and then switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Quadriceps-SMR',
  'quadriceps - stretching',
  '1. Lay facedown on the floor with your weight supported by your hands or forearms. Place a foam roll underneath one leg on the quadriceps, and keep the foot off of the ground. Make sure to relax the leg as much as possible. This will be your starting position.
2. Shifting as much weight onto the leg to be stretched as is tolerable, roll over the foam from above the knee to below the hip, holding points of tension for 10-30 seconds. Switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Rolo de Espuma' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Quick Leap',
  'quadriceps - plyometrics',
  '1. You will need a box for this exerise.
2. Begin facing the box standing 1-2 feet from its edge.
3. By utilizing your hips, hop onto the box, landing on both legs. Ensure that you land with your legs bent and your feet flat.
4. Immediately upon landing, fully extend through the entire body and swing your arms overhead to explode off of the box. Use your legs to absorb the impact of landing.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Rack Delivery',
  'shoulders - olympic weightlifting',
  '1. This drill teaches the delivery of the barbell to the rack position on the shoulders. Begin holding a bar in the scarecrow position, with the upper arms parallel to the floor, and the forearms hanging down. Use a hook grip, with your fingers wrapped over your thumbs.
2. Begin by rotating the elbows around the bar, delivering the bar to the shoulders. As your elbows come forward, relax your grip. The shoulders should be protracted, providing a shelf for the bar, which should lightly contact the throat.
3. It is important that the bar stay close to the body at all times, as with a heavier load any distance will result in an unwanted collision. As the movement becomes smoother, speed and load can be increased before progressing further.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Rack Pull with Bands',
  'lower back - powerlifting',
  '1. Set up in a power rack with the bar on the pins. The pins should be set to the desired point; just below the knees, just above, or in the mid thigh position. Attach bands to the base of the rack, or secure them with dumbbells. Attach the other end to the bar. You may need to choke the bands to provide tension.
2. Position yourself against the bar in proper deadlifting position. Your feet should be under your hips, your grip shoulder width, back arched, and hips back to engage the hamstrings. Since the weight is typically heavy, you may use a mixed grip, a hook grip, or use straps to aid in holding the weight.
3. With your head looking forward, extend through the hips and knees, pulling the weight up and back until lockout. Be sure to pull your shoulders back as you complete the movement. Return the weight to the pins and repeat.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Rack Pulls',
  'lower back - powerlifting',
  '1. Set up in a power rack with the bar on the pins. The pins should be set to the desired point; just below the knees, just above, or in the mid thigh position. Position yourself against the bar in proper deadlifting position. Your feet should be under your hips, your grip shoulder width, back arched, and hips back to engage the hamstrings. Since the weight is typically heavy, you may use a mixed grip, a hook grip, or use straps to aid in holding the weight.
2. With your head looking forward, extend through the hips and knees, pulling the weight up and back until lockout. Be sure to pull your shoulders back as you complete the movement.
3. Return the weight to the pins and repeat.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Rear Leg Raises',
  'quadriceps - stretching',
  '1. Place yourself on your hands knees on an exercise mat. Your head should be looking forward and the bend of the knees should create a 90-degree angle between the hamstrings and the calves. This will be your starting position.
2. Extend one leg up and behind you. The knee and hip should both extend. Repeat for 5-10 repetitions, and then switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Recumbent Bike',
  'quadriceps - cardio',
  '1. To begin, seat yourself on the bike and adjust the seat to your height.
2. Select the desired option from the menu. You may have to start pedaling to turn it on. You can use the manual setting, or you can select a program to use. Typically, you can enter your age and weight to estimate the amount of calories burned during exercise. The level of resistance can be changed throughout the workout. The handles can be used to monitor your heart rate to help you stay at an appropriate intensity.
3. Recumbent bikes offer convenience, cardiovascular benefits, and have less impact than other activities. A 150 lb person will burn about 230 calories cycling at a moderate rate for 30 minutes, compared to 450 calories or more running.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'cardio',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Return Push from Stance',
  'shoulders - plyometrics',
  '1. You will need a partner for this drill.
2. Begin in an athletic 2 or 3 point stance.
3. At the signal, move into a position to receive the pass from your partner.
4. Catch the medicine ball with both hands and immediately throw it back to your partner.
5. You can modify this drill by running different routes.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Reverse Band Bench Press',
  'triceps - powerlifting',
  '1. Position a bench inside a power rack, with the bar set to the correct height. Begin by anchoring bands either to band pegs or to the top of the rack. Ensure that you will be position properly under the bands. Attach the other end to the barbell.
2. Lie on the bench, tuck your feet underneath you and arch your back. Using the bar to help support your weight, lift your shoulder off the bench and retract them, squeezing the shoulder blades together. Use your feet to drive your traps into the bench. Maintain this tight body position throughout the movement. However wide your grip, it should cover the ring on the bar.
3. Pull the bar out of the rack without protracting your shoulders. Focus on squeezing the bar and trying to pull it apart. Lower the bar to your lower chest or upper stomach. The bar, wrist, and elbow should stay in line at all times.
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
  'Reverse Band Box Squat',
  'quadriceps - powerlifting',
  '1. Begin in a power rack with a box at the appropriate height behind you. Set up the bands either on band pegs or attached to the top of the rack, ensuring they will be directly above the bar during the squat. Attach the other end to the bar.
2. Begin by stepping under the bar and placing it across the back of the shoulders. Squeeze your shoulder blades together and rotate your elbows forward, attempting to bend the bar across your shoulders. Remove the bar from the rack, creating a tight arch in your lower back, and step back into position. Place your feet wider for more emphasis on the back, glutes, adductors, and hamstrings, or closer together for more quad development. Keep your head facing forward.
3. With your back, shoulders, and core tight, push your knees and butt out and you begin your descent. Sit back with your hips until you are seated on the box. Ideally, your shins should be perpendicular to the ground. Pause when you reach the box, and relax the hip flexors. Never bounce off of a box.
4. Keeping the weight on your heels and pushing your feet and knees out, drive upward off of the box as you lead the movement with your head. Continue upward, maintaining tightness head to toe. Use care to return the barbell to the rack.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Reverse Band Deadlift',
  'lower back - powerlifting',
  '1. Set the bar up in a power rack. Attach bands to the top of the rack, using either bands pegs or the frame itself. Attach the other end of the bands to the bar.
2. Approach the bar so that it is centered over your feet. You feet should be about hip width apart. Bend at the hip to grip the bar at shoulder width, allowing your shoulder blades to protract. Typically, you would use an overhand grip or an over/under grip on heavier sets.
3. With your feet, and your grip set, take a big breath and then lower your hips and bend the knees until your shins contact the bar. Look forward with your head, keep your chest up and your back arched, and begin driving through the heels to move the weight upward.
4. After the bar passes the knees, aggressively pull the bar back, pulling your shoulder blades together as you drive your hips forward into the bar.
5. Lower the bar by bending at the hips and guiding it to the floor.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Reverse Band Power Squat',
  'quadriceps - powerlifting',
  '1. Begin in a power rack with the pins and bar set at the appropriate height. After loading the bar, attach bands to the top of the rack, using either pegs or the frame itself. Attach the other end of the bands to the bar.
2. Begin by stepping under the bar and placing it across the back of the shoulders. Squeeze your shoulder blades together and rotate your elbows forward, attempting to bend the bar across your shoulders. Remove the bar from the rack, creating a tight arch in your lower back, and step back into position. Place your feet wide for more emphasis on the back, glutes, adductors, and hamstrings.
3. Keep your head facing forward. With your back, shoulders, and core tight, push your knees and butt out and you begin your descent. Sit back with your hips as much as possible. Ideally, your shins should be perpendicular to the ground. Lower bar position necessitates a greater torso lean to keep the bar over the heels. Continue until you break parallel, which is defined as the crease of the hip being in line with the top of the knee.
4. Keeping the weight on your heels and pushing your feet and knees out, drive upward as you lead the movement with your head. Continue upward, maintaining tightness head to toe, until you have returned to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Reverse Band Sumo Deadlift',
  'hamstrings - powerlifting',
  '1. Begin with a bar loaded on the floor inside of a power rack. Attach bands to the top of the rack, using either pegs or the frame itself. Attach the other end to the barbell.
2. Approach the bar so that the bar intersects the middle of the feet. The feet should be set very wide, near the collars. Bend at the hips to grip the bar. The arms should be directly below the shoulders, inside the legs, and you can use a pronated grip, a mixed grip, or hook grip. Relax the shoulders, which in effect lengthens your arms.
3. Take a breath, and then lower your hips, looking forward with your head with your chest up. Drive through the floor, spreading your feet apart, with your weight on the back half of your feet. Extend through the hips and knees.
4. As the bar passes through the knees, lean back and drive the hips into the bar, pulling your shoulder blades together.
5. Return the weight to the ground by bending at the hips and controlling the weight on the way down.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Reverse Barbell Curl',
  'biceps - strength',
  '1. Stand up with your torso upright while holding a barbell at shoulder width with the elbows close to the torso. The palm of your hands should be facing down (pronated grip). This will be your starting position.
2. While holding the upper arms stationary, curl the weights while contracting the biceps as you breathe out. Only the forearms should move. Continue the movement until your biceps are fully contracted and the bar is at shoulder level. Hold the contracted position for a second as you squeeze the muscle.
3. Slowly begin to bring the bar back to starting position as your breathe in.
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
  'Reverse Barbell Preacher Curls',
  'biceps - strength',
  '1. Grab an EZ-bar using a shoulder width and palms down (pronated) grip.
2. Now place the upper part of both arms on top of the preacher bench and have your arms extended. This will be your starting position.
3. As you exhale, use the biceps to curl the weight up until your biceps are fully contracted and the barbell is at shoulder height. Squeeze the biceps hard for a second at the contracted position.
4. As you breathe in, slowly lower the barbell until your upper arms are extended and the biceps is fully stretched.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Reverse Cable Curl',
  'biceps - strength',
  '1. Stand up with your torso upright while holding a bar attachment that is attached to a low pulley using a pronated (palms down) and shoulder width grip. Make sure also that you keep the elbows close to the torso. This will be your starting position.
2. While holding the upper arms stationary, curl the weights while contracting the biceps as you breathe out. Only the forearms should move. Continue the movement until your biceps are fully contracted and the bar is at shoulder level. Hold the contracted position for a second as you squeeze the muscle.
3. Slowly begin to bring the bar back to starting position as your breathe in.
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
  'Reverse Crunch',
  'abdominals - strength',
  '1. Lie down on the floor with your legs fully extended and arms to the side of your torso with the palms on the floor. Your arms should be stationary for the entire exercise.
2. Move your legs up so that your thighs are perpendicular to the floor and feet are together and parallel to the floor. This is the starting position.
3. While inhaling, move your legs towards the torso as you roll your pelvis backwards and you raise your hips off the floor. At the end of this movement your knees will be touching your chest.
4. Hold the contraction for a second and move your legs back to the starting position while exhaling.
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
  'Reverse Flyes',
  'shoulders - strength',
  '1. To begin, lie down on an incline bench with the chest and stomach pressing against the incline. Have the dumbbells in each hand with the palms facing each other (neutral grip).
2. Extend the arms in front of you so that they are perpendicular to the angle of the bench. The legs should be stationary while applying pressure with the ball of your toes. This is the starting position.
3. Maintaining the slight bend of the elbows, move the weights out and away from each other (to the side) in an arc motion while exhaling. Tip: Try to squeeze your shoulder blades together to get the best results from this exercise.
4. The arms should be elevated until they are parallel to the floor.
5. Feel the contraction and slowly lower the weights back down to the starting position while inhaling.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Reverse Flyes With External Rotation',
  'shoulders - strength',
  '1. To begin, lie down on an incline bench set at a 30-degree angle with the chest and stomach pressing against the incline.
2. Have the dumbbells in each hand with the palms facing down to the floor. Your arms should be in front of you so that they are perpendicular to the angle of the bench. Tip: Your elbows should have a slight bend. The legs should be stationary while applying pressure with the ball of your toes (your heels should not be touching the floor). This is the starting position.
3. Maintaining the slight bend of the elbows, move the weights out and away from each other in an arc motion while exhaling.
4. As you lift the weight, your wrist should externally rotate by 90-degrees so that you go from a palms down (pronated) grip to a palms facing each other (neutral) grip. Tip: Try to squeeze your shoulder blades together to get the best results from this exercise.
5. The arms should be elevated until they are level with the head.
6. Feel the contraction and slowly lower the weights back down to the starting position while inhaling.
7. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Reverse Grip Bent-Over Rows',
  'middle back - strength',
  '1. Stand erect while holding a barbell with a supinated grip (palms facing up).
2. Bend your knees slightly and bring your torso forward, by bending at the waist, while keeping the back straight until it is almost parallel to the floor. Tip: Make sure that you keep the head up. The barbell should hang directly in front of you as your arms hang perpendicular to the floor and your torso. This is your starting position.
3. While keeping the torso stationary, lift the barbell as you breathe out, keeping the elbows close to the body and not doing any force with the forearm other than holding the weights. On the top contracted position, squeeze the back muscles and hold for a second.
4. Slowly lower the weight again to the starting position as you inhale.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Reverse Grip Triceps Pushdown',
  'triceps - strength',
  '1. Start by setting a bar attachment (straight or e-z) on a high pulley machine.
2. Facing the bar attachment, grab it with the palms facing up (supinated grip) at shoulder width. Lower the bar by using your lats until your arms are fully extended by your sides. Tip: Elbows should be in by your sides and your feet should be shoulder width apart from each other. This is the starting position.
3. Slowly elevate the bar attachment up as you inhale so it is aligned with your chest. Only the forearms should move and the elbows/upper arms should be stationary by your side at all times.
4. Then begin to lower the cable bar back down to the original staring position while exhaling and contracting the triceps hard.
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
  'Reverse Hyperextension',
  'hamstrings - strength',
  '1. Place your feet between the pads after loading an appropriate weight. Lay on the top pad, allowing your hips to hang off the back, while grasping the handles to hold your position.
2. To begin the movement, flex the hips, pulling the legs forward.
3. Reverse the motion by extending the hips, kicking the leg back. It is very important not to over-extend the hip on this movement, stopping short of your full range of motion.
4. Return by again flexing the hip, pulling the carriage forward as far as you can.
5. Repeat for the desired number of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Reverse Machine Flyes',
  'shoulders - strength',
  '1. Adjust the handles so that they are fully to the rear. Make an appropriate weight selection and adjust the seat height so the handles are at shoulder level. Grasp the handles with your hands facing inwards. This will be your starting position.
2. In a semicircular motion, pull your hands out to your side and back, contracting your rear delts.
3. Keep your arms slightly bent throughout the movement, with all of the motion occurring at the shoulder joint.
4. Pause at the rear of the movement, and slowly return the weight to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Reverse Plate Curls',
  'biceps - strength',
  '1. Start by standing straight with a weighted plate held by both hands and arms fully extended. Use a pronated grip (palms facing down) and make sure your fingers grab the rough side of the plate while your thumb grabs the smooth side. Note: For the best results, grab the weighted plate at an 11:00 and 1:00 o''clock position.
2. Your feet should be shoulder width apart from each other and the weighted plate should be near the groin area. This is the starting position.
3. Slowly lift the plate up while keeping the elbows in and the upper arms stationary until your biceps and forearms touch while exhaling. The plate should be evenly aligned with your torso at this point.
4. Feel the contraction for a second and begin to lower the weight back down to the starting position while inhaling
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Reverse Triceps Bench Press',
  'triceps - strength',
  '1. Lie back on a flat bench. Using a close, supinated grip (around shoulder width), lift the bar from the rack and hold it straight over you with your arms locked extended in front of you and perpendicular to the floor. This will be your starting position.
2. As you breathe in, come down slowly until you feel the bar on your middle chest. Tip: Make sure that as opposed to a regular bench press, you keep the elbows close to the torso at all times in order to maximize triceps involvement.
3. After a second pause, bring the bar back to the starting position as you breathe out and push the bar using your triceps muscles. Lock your arms in the contracted position, hold for a second and then start coming down slowly again. Tip: It should take at least twice as long to go down than to come up.
4. Repeat the movement for the prescribed amount of repetitions.
5. When you are done, place the bar back in the rack.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Rhomboids-SMR',
  'middle back - stretching',
  '1. Lay down with your back on the floor. Place a foam roll underneath your upper back, and cross your arms in front of you, protracting your shoulders. This will be your starting position.
2. Raise your hips off of the ground, placing your weight onto the foam roll. Shift your weight to one side at a time, rolling over your middle and upper back. Pause at points of tension for 10-30 seconds.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Rolo de Espuma' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Rickshaw Carry',
  'forearms - strongman',
  '1. Position the frame at the starting point, and load with the appropriate weight. Standing in the center of the frame, begin by gripping the handles and driving through your heels to lift the frame. Ensure your chest and head are up and your back is straight.
2. Immediately begin walking briskly with quick, controlled steps. Keep your chest up and head forward, and make sure you continue breathing. Bring the frame to the ground after you have reached the end point.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Antebraço' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Rickshaw Deadlift',
  'quadriceps - strongman',
  '1. Load the frame with the desired weight. Center yourself between the handles. You feet should be about hip width apart. Bend at the hips to grip the handles, allowing your shoulder blades to protract.
2. With your feet and your grip set, take a big breath and then lower your hips and flex the knees. Look forward with your head, keep your chest up and your back arched, and begin driving through the heels to move the weight upward. As the weight comes up, pull your shoulder blades together as you drive your hips forward.
3. Lower the weight by bending at the hips and guiding it to the ground.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Ring Dips',
  'triceps - strength',
  '1. Grip a ring in each hand, and then take a small jump to help you get into the starting position with your arms locked out.
2. Begin by flexing the elbow, lowering your body until your arms break 90 degrees. Avoid swinging, and maintain good posture throughout the descent.
3. Reverse the motion by extending the elbow, pushing yourself back up into the starting position.
4. Repeat for the desired number of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Rocket Jump',
  'quadriceps - plyometrics',
  '1. Begin in a relaxed stance with your feet shoulder width apart and hold your arms close to the body.
2. To initiate the move, squat down halfway and explode back up as high as possible.
3. Fully extend your entire body, reaching overhead as far as possible. As you land, absorb your impact through the legs.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Rocking Standing Calf Raise',
  'calves - strength',
  '1. This exercise is best performed inside a squat rack for safety purposes. To begin, first set the bar on a rack that best matches your height. Once the correct height is chosen and the bar is loaded, step under the bar and place it on the back of your shoulders (slightly below the neck).
2. Hold on to the bar using both arms at each side and lift it off the rack by first pushing with your legs and at the same time straightening your torso.
3. Step away from the rack and position your legs using a shoulder width medium stance with the toes slightly pointed out. Keep your head up at all times as looking down will get you off balance. Also maintain a straight back and keep the knees with a slight bend; never locked. This will be your starting position.
4. Raise your heels as you breathe out by extending your ankles as high as possible and flexing your calf. Ensure that the knee is kept stationary at all times. There should be no bending (other than the slight initial bend we created during positioning) at any time. Hold the contracted position by a second before you start to go back down.
5. Go back slowly to the starting position as you breathe in by lowering your heels as you bend the ankles until calves are stretched.
6. Now lift your toes by contracting the tibia muscles in the front of the calves as you breathe out.
7. Hold for a second and bring them back down as you breathe in.
8. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Panturrilha' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Rocky Pull-Ups/Pulldowns',
  'lats - strength',
  '1. Grab the pull-up bar with the palms facing forward using a wide grip.
2. As you have both arms extended in front of you holding the bar at the chosen grip width, bring your torso back around 30 degrees or so while creating a curvature on your lower back and sticking your chest out. This is your starting position.
3. Pull your torso up until the bar touches your upper chest by drawing the shoulders and the upper arms down and back. Exhale as you perform this portion of the movement. Tip: Concentrate on squeezing the back muscles once you reach the full contracted position. The upper torso should remain stationary as it moves through space and only the arms should move. The forearms should do no other work other than hold the bar.
4. After a second on the contracted position, start to inhale and slowly lower your torso back to the starting position when your arms are fully extended and the lats are fully stretched.
5. Now repeat the same movements as described above except this time your torso will remain straight as you go up and the bar will touch the back of the neck instead of the upper chest. Tip: Use the head to lean forward slightly as it will help you properly execute this portion of the exercise.
6. Once you have lowered yourself back down to the starting position, repeat the exercise for the prescribed amount of repetitions in your program.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Levantamento Terra Romeno',
  'hamstrings - strength',
  '1. Put a barbell in front of you on the ground and grab it using a pronated (palms facing down) grip that a little wider than shoulder width. Tip: Depending on the weight used, you may need wrist wraps to perform the exercise and also a raised platform in order to allow for better range of motion.
2. Bend the knees slightly and keep the shins vertical, hips back and back straight. This will be your starting position.
3. Keeping your back and arms completely straight at all times, use your hips to lift the bar as you exhale. Tip: The movement should not be fast but steady and under control.
4. Once you are standing completely straight up, lower the bar by pushing the hips back, only slightly bending the knees, unlike when squatting. Tip: Take a deep breath at the start of the movement and keep your chest up. Hold your breath as you lower and exhale as you complete the movement.
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
  'Romanian Deadlift from Deficit',
  'hamstrings - olympic weightlifting',
  '1. Begin standing while holding a bar at arm''s length in front of you. You can stand on a raised platform to increase the range of motion.
2. Begin by flexing the knees slightly, and then flex at the hip, moving your butt back as far as possible, lowering the torso as far as flexibility allows. The back should remain in absolute extension at all times, and the bar should remain in contact with the legs. If done properly, there should be heavy tension felt in the hamstrings.
3. Reverse the motion to return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Rope Climb',
  'lats - strength',
  '1. Grab the rope with both hands above your head. Pull down on the rope as you take a small jump.
2. Wrap the rope around one leg, using your feet to pinch the rope. Reach up as high as possible with your arms, gripping the rope tightly.
3. Release the rope from your feet as you pull yourself up with your arms, bringing your knees towards your chest.
4. Resecure your feet on the rope, and then stand up to take another high hold on the rope. Continue until you reach the top of the rope.
5. To lower yourself, loosen the grip of your feet on the rope as you slide down using a hand over hand motion.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Rope Crunch',
  'abdominals - strength',
  '1. Kneel 1-2 feet in front of a cable system with a rope attached.
2. After selecting an appropriate weight, grasp the rope with both hands reaching overhead. Your torso should be upright in the starting position.
3. To begin, flex at the spine, attempting to bring your rib cage to your legs as you pull the cable down.
4. Pause at the bottom of the motion, and then slowly return to the starting position.
5. These can be done with twists or to the side to hit the obliques.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Rope Jumping',
  'quadriceps - cardio',
  '1. Hold an end of the rope in each hand. Position the rope behind you on the ground. Raise your arms up and turn the rope over your head bringing it down in front of you. When it reaches the ground, jump over it. Find a good turning pace that can be maintained. Different speeds and techniques can be used to introduce variation.
2. Rope jumping is exciting, challenges your coordination, and requires a lot of energy. A 150 lb person will burn about 350 calories jumping rope for 30 minutes, compared to over 450 calories running.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'cardio',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Rope Straight-Arm Pulldown',
  'lats - strength',
  '1. Attach a rope to a high pulley and make your weight selection. Stand a couple feet back from the pulley with your feet staggered and take the rope with both hands. Lean forward from the hip, keeping your back straight, with your arms extended up in front of you. This will be your starting position.
2. Keeping your arms straight, extend the shoulder to pull the rope down to your thighs.
3. Pause at the bottom of the motion, squeezing your lats.
4. Return to the starting position without allowing the weight to fully rest on the stack.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Round The World Shoulder Stretch',
  'shoulders - stretching',
  '1. Stand up straight with your legs together, holding a bodybar or broomstick.
2. Hold the pole behind your hips with a wider than shoulder width grip. Your palms should be down and your thumbs facing out.
3. Slowly lift your arms up behind your head. Don''t force it if it gets hard to lift further.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Rowing, Stationary',
  'quadriceps - cardio',
  '1. To begin, seat yourself on the rower. Make sure that your heels are resting comfortably against the base of the foot pedals and that the straps are secured. Select the program that you wish to use, if applicable. Sit up straight and bend forward at the hips.
2. There are three phases of movement when using a rower. The first phase is when you come forward on the rower. Your knees are bent and against your chest. Your upper body is leaning slightly forward while still maintaining good posture. Next, push against the foot pedals and extend your legs while bringing your hands to your upper abdominal area, squeezing your shoulders back as you do so. To avoid straining your back, use primarily your leg and hip muscles.
3. The recovery phase simply involves straightening your arms, bending the knees, and bringing your body forward again as you transition back into the first phase.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'intermediate',
  'cardio',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Runner''s Stretch',
  'hamstrings - stretching',
  '1. It''s easiest to get into this stretch if you start standing up, put one leg behind you, and slowly lower your torso down to the floor.
2. Keep the front heel on the floor (if it lifts up, scoot your other leg further back).
3. Place your hands on either side of your front leg. To get more out of this stretch, push your butt up toward the ceiling, and then gradually lower it back toward the floor. You''ll Stretch the hip flexor of the back leg and the hamstring and buttocks of the front.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Running, Treadmill',
  'quadriceps - cardio',
  '1. To begin, step onto the treadmill and select the desired option from the menu. Most treadmills have a manual setting, or you can select a program to run. Typically, you can enter your age and weight to estimate the amount of calories burned during exercise. Elevation can be adjusted to change the intensity of the workout.
2. Treadmills offer convenience, cardiovascular benefits, and usually have less impact than running outside. A 150 lb person will burn over 450 calories running 8 miles per hour for 30 minutes. Maintain proper posture as you run, and only hold onto the handles when necessary, such as when dismounting or checking your heart rate.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'cardio',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Rotação Russa',
  'abdominals - strength',
  '1. Lie down on the floor placing your feet either under something that will not move or by having a partner hold them. Your legs should be bent at the knees.
2. Elevate your upper body so that it creates an imaginary V-shape with your thighs. Your arms should be fully extended in front of you perpendicular to your torso and with the hands clasped. This is the starting position.
3. Twist your torso to the right side until your arms are parallel with the floor while breathing out.
4. Hold the contraction for a second and move back to the starting position while breathing out. Now move to the opposite side performing the same techniques you applied to the right side.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Sandbag Load',
  'quadriceps - strongman',
  '1. To load sandbags or other objects, begin with the implements placed a distance from the loading platform, typically 50 feet.
2. Begin by lifting the sandbag. Sandbags are extremely awkward, and the manner of lifting them can vary depending on the particular sandbag used. Reach as far around it as possible, extending through the hips and knees to pull it up high. Shouldering is usually not allowed.
3. Move as quickly as possible to the platform, and load it, extending through your hips, knees, and ankles to get it as high as possible. Place it onto the platform, ensuring it doesn''t fall off.
4. Return to the starting position to retrieve the next sandbag, and repeat until the event is completed.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Scapular Pull-Up',
  'traps - strength',
  '1. Take a pronated grip on a pull-up bar.
2. From a hanging position, raise yourself a few inches without using your arms. Do this by depressing your shoulder girdle in a reverse shrugging motion.
3. Pause at the completion of the movement, and then slowly return to the starting position before performing more repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Trapézio' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Scissor Kick',
  'abdominals - stretching',
  '1. To begin, lie down with your back pressed against the floor or on an exercise mat (optional). Your arms should be fully extended to the sides with your palms facing down. Note: The arms should be stationary the entire time.
2. With a slight bend at the knees, lift your legs up so that your heels are about 6 inches off the ground. This is the starting position.
3. Now lift your left leg up to about a 45 degree angle while your right leg is lowered until the heel is about 2-3 inches from the ground.
4. Switch movements by raising your right leg up and lowering your left leg. Remember to breathe while performing this exercise.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Scissors Jump',
  'quadriceps - plyometrics',
  '1. Assume a lunge stance position with one foot forward with the knee bent, and the rear knee nearly touching the ground.
2. Ensure that the front knee is over the midline of the foot. Extending through both legs, jump as high as possible, swinging your arms to gain lift.
3. As you jump as high as you can, switch the position of your legs, moving your front leg to the back and the rear leg to the front.
4. As you land, absorb the impact through the legs by adopting the lunge position, and repeat.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Band Hamstring Curl',
  'hamstrings - strength',
  '1. Secure a band close to the ground and place a bench a couple feet away from it.
2. Seat yourself on the bench and secure the band behind your ankles, beginning with your legs straight. This will be your starting position.
3. Flex the knees, bringing your feet towards the bench. You may need to lean back slightly to keep your feet from striking the floor.
4. Pause at the completion of the movement, and then slowly return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Barbell Military Press',
  'shoulders - strength',
  '1. Sit on a Military Press Bench with a bar behind your head and either have a spotter give you the bar (better on the rotator cuff this way) or pick it up yourself carefully with a pronated grip (palms facing forward). Tip: Your grip should be wider than shoulder width and it should create a 90-degree angle between the forearm and the upper arm as the barbell goes down.
2. Once you pick up the barbell with the correct grip length, lift the bar up over your head by locking your arms. Hold at about shoulder level and slightly in front of your head. This is your starting position.
3. Lower the bar down to the collarbone slowly as you inhale.
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
  'Seated Barbell Twist',
  'abdominals - strength',
  '1. Start out by sitting at the end of a flat bench with a barbell placed on top of your thighs. Your feet should be shoulder width apart from each other.
2. Grip the bar with your palms facing down and make sure your hands are wider than shoulder width apart from each other. Begin to lift the barbell up over your head until your arms are fully extended.
3. Now lower the barbell behind your head until it is resting along the base of your neck. This is the starting position.
4. While keeping your feet and head stationary, move your waist from side to side so that your oblique muscles feel the contraction. Only move from side to side as far as your waist will allow you to go. Stretching or moving too far can cause an injury to occur. Tip: Use a slow and controlled motion.
5. Remember to breathe out while twisting your body to the side and in when moving back to the starting position.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Bent-Over One-Arm Dumbbell Triceps Extension',
  'triceps - strength',
  '1. Sit down at the end of a flat bench with a dumbbell in one arm using a neutral grip (palms of the hand facing you).
2. Bend your knees slightly and bring your torso forward, by bending at the waist, while keeping the back straight until it is almost parallel to the floor. Make sure that you keep the head up.
3. The upper arm with the dumbbell should be close to the torso and aligned with it (lifted up until it is parallel to the floor while the forearms are pointing towards the floor as the hands hold the weights). Tip: There should be a 90-degree angle between the forearms and the upper arm. This is your starting position.
4. Keeping the upper arm stationary, use the triceps to lift the weight as you exhale until the forearm is parallel to the floor and the whole arm is extended. Like many other arm exercises, only the forearm moves.
5. After a second contraction at the top, slowly lower the dumbbell back to the starting position as you inhale.
6. Repeat the movement for the prescribed amount of repetitions.
7. Switch arms and repeat the exercise.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Bent-Over Rear Delt Raise',
  'shoulders - strength',
  '1. Place a couple of dumbbells looking forward in front of a flat bench.
2. Sit on the end of the bench with your legs together and the dumbbells behind your calves.
3. Bend at the waist while keeping the back straight in order to pick up the dumbbells. The palms of your hands should be facing each other as you pick them. This will be your starting position.
4. Keeping your torso forward and stationary, and the arms slightly bent at the elbows, lift the dumbbells straight to the side until both arms are parallel to the floor. Exhale as you lift the weights. (Note: avoid swinging the torso or bringing the arms back as opposed to the side.)
5. After a one second contraction at the top, slowly lower the dumbbells back to the starting position.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Bent-Over Two-Arm Dumbbell Triceps Extension',
  'triceps - strength',
  '1. Sit down at the end of a flat bench with a dumbbell in both arms using a neutral grip (palms of the hand facing you).
2. Bend your knees slightly and bring your torso forward, by bending at the waist, while keeping the back straight until it is almost parallel to the floor. Make sure that you keep the head up.
3. The upper arms with the dumbbells should be close to the torso and aligned with it (lifted up until they are parallel to the floor while the forearms are pointing towards the floor as the hands hold the weights). Tip: There should be a 90-degree angle between the forearms and the upper arm. This is your starting position.
4. Keeping the upper arms stationary, use the triceps to lift the weight as you exhale until the forearms are parallel to the floor and the whole arm is extended. Like many other arm exercises, only the forearm moves.
5. After a second contraction at the top, slowly lower the dumbbells back to the starting position as you inhale.
6. Repeat the movement for the prescribed amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Biceps',
  'biceps - stretching',
  '1. Sit on the floor with your knees bent and your partner standing behind you. Extend your arms straight behind you with your palms facing each other. Your partner will hold your wrists for you. This will be the starting position.
2. Attempt to flex your elbows, while your partner prevents any actual movement.
3. After 10-20 seconds, relax your arms while your partner gently pulls your wrists up to stretch your biceps. Be sure to let your partner know when the stretch is appropriate to prevent injury or overstretching.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'advanced',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Remada Sentada no Cabo',
  'middle back - strength',
  '1. For this exercise you will need access to a low pulley row machine with a V-bar. Note: The V-bar will enable you to have a neutral grip where the palms of your hands face each other. To get into the starting position, first sit down on the machine and place your feet on the front platform or crossbar provided making sure that your knees are slightly bent and not locked.
2. Lean over as you keep the natural alignment of your back and grab the V-bar handles.
3. With your arms extended pull back until your torso is at a 90-degree angle from your legs. Your back should be slightly arched and your chest should be sticking out. You should be feeling a nice stretch on your lats as you hold the bar in front of you. This is the starting position of the exercise.
4. Keeping the torso stationary, pull the handles back towards your torso while keeping the arms close to it until you touch the abdominals. Breathe out as you perform that movement. At that point you should be squeezing your back muscles hard. Hold that contraction for a second and slowly go back to the original position while breathing in.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Cable Shoulder Press',
  'shoulders - strength',
  '1. Adjust the weight to an appropriate amount and be seated, grasping the handles. Your upper arms should be about 90 degrees to the body, with your head and chest up. The elbows should also be bent to about 90 degrees. This will be your starting position.
2. Begin by extending through the elbow, pressing the handles together above your head.
3. After pausing at the top, return the handles to the starting position. Ensure that you maintain tension on the cables.
4. You can also execute this movement with your back off the pad and alternate hands.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Calf Raise',
  'calves - strength',
  '1. Sit on the machine and place your toes on the lower portion of the platform provided with the heels extending off. Choose the toe positioning of your choice (forward, in, or out) as per the beginning of this chapter.
2. Place your lower thighs under the lever pad, which will need to be adjusted according to the height of your thighs. Now place your hands on top of the lever pad in order to prevent it from slipping forward.
3. Lift the lever slightly by pushing your heels up and release the safety bar. This will be your starting position.
4. Slowly lower your heels by bending at the ankles until the calves are fully stretched. Inhale as you perform this movement.
5. Raise the heels by extending the ankles as high as possible as you contract the calves and breathe out. Hold the top contraction for a second.
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
  'Seated Calf Stretch',
  'calves - stretching',
  '1. Sit up straight on an exercise mat.
2. Bend one knee and put that foot on the floor to stabilize the torso.
3. Straighten your other leg and flex your ankle.
4. Using a band, towel, or your hand if you can reach, pull the toes toward you. Hold for 10 to 20 seconds, then switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Panturrilha' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Close-Grip Concentration Barbell Curl',
  'biceps - strength',
  '1. Sit down on a flat bench with a barbell or E-Z Bar in front of you in between your legs. Your legs should be spread with the knees bent and the feet on the floor.
2. Use your arms to pick the barbell up and place the back of your upper arms on top of your inner thighs (around three and a half inches away from the front of the knee). A supinated grip closer than shoulder width is needed to perform this exercise. Tip: Your arm should be extended at arms length and the barbell should be above the floor. This will be your starting position.
3. While holding the upper arms stationary, curl the weights forward while contracting the biceps as you breathe out. Only the forearms should move. Continue the movement until your biceps are fully contracted and the dumbbells are at shoulder level. Hold the contracted position for a second as you squeeze the biceps.
4. Slowly begin to bring the barbell back to starting position as your breathe in. Tip: Avoid swinging motions at any time.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Dumbbell Curl',
  'biceps - strength',
  '1. Sit on a flat bench with a dumbbell on each hand being held at arms length. The elbows should be close to the torso.
2. Rotate the palms of the hands so that they are facing your torso. This will be your starting position.
3. While holding the upper arm stationary, curl the weights and start twisting the wrists once the dumbbells pass your thighs so that the palms of your hands face forward at the end of the movement. Make sure that you contract the biceps as you breathe out and make sure that only the forearms move. Continue the movement until your biceps are fully contracted and the dumbbells are at shoulder level. Hold the contracted position for a second as you squeeze the biceps.
4. Slowly begin to bring the dumbbells back to the starting position as your breathe in and as you rotate the wrists back to a neutral grip.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Dumbbell Inner Biceps Curl',
  'biceps - strength',
  '1. Sit on the end of a flat bench with a dumbbell in each hand being held at arms length. The elbows should be close to the torso.
2. Rotate the palms of the hands so that they are facing inward in a neutral position. This will be your starting position.
3. While holding the upper arms stationary, curl the dumbbells out and up, turning the palms out as you lift and keeping your forearms in line with your outer deltoids. Tips:
4. Only the forearms should move. Continue the movement until your biceps are fully contracted and the dumbbells are at shoulder level. Hold the contracted position for a second as you squeeze the biceps.
5. Slowly begin to bring the dumbbells back to the starting position as your breathe in. Remember to rotate your arms as you lower the dumbbells so that you can switch back to a neutral grip.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Dumbbell Palms-Down Wrist Curl',
  'forearms - strength',
  '1. Start out by placing two dumbbells on the floor in front of a flat bench.
2. Sit down on the edge of the flat bench with your legs at about shoulder width apart. Make sure to keep your feet on the floor.
3. Use your arms to grab both of the dumbbells and bring them up so that your forearms are resting against your thighs with the palms of the hands facing down. Your wrists should be hanging over the edge of your thighs.
4. Start out by curling your wrist upwards and exhaling.
5. Slowly lower your wrists back down to the starting position while inhaling. Make sure to inhale during this part of the exercise. Tip: Your forearms should be stationary as your wrist is the only movement needed to perform this exercise.
6. Repeat for the recommended amount of repetitions.
7. When finished, simply lower the dumbbells to the floor.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Antebraço' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Dumbbell Palms-Up Wrist Curl',
  'forearms - strength',
  '1. Start out by placing two dumbbells on the floor in front of a flat bench.
2. Sit down on the edge of the flat bench with your legs at about shoulder width apart. Make sure to keep your feet on the floor.
3. Use your arms to grab both of the dumbbells and bring them up so that your forearms are resting against your thighs with the palms of the hands facing up. Your wrists should be hanging over the edge of your thighs.
4. Start out by curling your wrist upwards and exhaling.
5. Slowly lower your wrists back down to the starting position while inhaling. Make sure to inhale during this part of the exercise. Tip: Your forearms should be stationary as your wrist is the only movement needed to perform this exercise.
6. Repeat for the recommended amount of repetitions.
7. When finished, simply lower the dumbbells to the floor.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Antebraço' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Dumbbell Press',
  'shoulders - strength',
  '1. Grab a couple of dumbbells and sit on a military press bench or a utility bench that has a back support on it as you place the dumbbells upright on top of your thighs.
2. Clean the dumbbells up one at a time by using your thighs to bring the dumbbells up to shoulder height at each side.
3. Rotate the wrists so that the palms of your hands are facing forward. This is your starting position.
4. As you exhale, push the dumbbells up until they touch at the top.
5. After a second pause, slowly come down back to the starting position as you inhale.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Flat Bench Leg Pull-In',
  'abdominals - strength',
  '1. Sit on a bench with the legs stretched out in front of you slightly below parallel and your arms holding on to the sides of the bench. Your torso should be leaning backwards around a 45-degree angle from the bench. This will be your starting position.
2. Bring the knees in toward you as you move your torso closer to them at the same time. Breathe out as you perform this movement.
3. After a second pause, go back to the starting position as you inhale.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Floor Hamstring Stretch',
  'hamstrings - stretching',
  '1. Sit on a mat with your right leg extended in front of you and your left leg bent with your foot against your right inner thigh.
2. Lean forward from your hips and reach for your ankle until you feel a stretch in your hamstring. Hold for 15 seconds, then repeat for your other side.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Front Deltoid',
  'shoulders - stretching',
  '1. Sit upright on the floor with your legs bent, your partner standing behind you. Stick your arms straight out to your sides, with your palms facing the ground. Attempt to move them as far behind you as possible, as your assistant holds your wrists. This will be your starting position.
2. Keeping your elbows straight, attempt to move your arms to the front, with your partner gently restraining you to prevent any actual movement for 10-20 seconds.
3. Now, relax your muscles and allow your partner to gently increase the stretch on the shoulders and chest. Hold for 10 to 20 seconds.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'advanced',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Glute',
  'glutes - stretching',
  '1. In a seated position with your knees bent, cross one ankle over the opposite knee. Your partner will stand behind you. Now, lean forward as your partner braces your shoulders with their hands. This will be your starting position.
2. Attempt to push your torso back for 10-20 seconds, as your partner prevents any actual movement of your torso.
3. Now relax your muscles as your partner increases the stretch by gently pushing your torso forward for 10-20 seconds.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'advanced',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Good Mornings',
  'lower back - powerlifting',
  '1. Set up a box in a power rack. The pins should be set at an appropriate height. Begin by stepping under the bar and placing it across the back of the shoulders, not on top of your traps. Squeeze your shoulder blades together and rotate your elbows forward, attempting to bend the bar across your shoulders.
2. Remove the bar from the rack, creating a tight arch in your lower back. Keep your head facing forward. With your back, shoulders, and core tight, push your knees and butt out and you begin your descent. Sit back with your hips until you are seated on the box. This will be your starting position.
3. Keeping the bar tight, bend forward at the hips as much as possible. If you set the pins to what would be parallel, you not only have a safety if you fail, but know when to stop.
4. Pause just above the pins and reverse the motion until your torso it upright.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Hamstring',
  'hamstrings - stretching',
  '1. In a seated position with your legs extended, have your partner stand behind you. Now, lean forward as your partner braces your shoulders with their hands. This will be your starting position.
2. Attempt to push your torso back for 10-20 seconds, as your partner prevents any actual movement of your torso.
3. Now relax your muscles as your partner increases the stretch by gently pushing your torso forward for 10-20 seconds.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'advanced',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Hamstring and Calf Stretch',
  'hamstrings - stretching',
  '1. Loop a belt, rope, or band around one foot. Sit down with both legs extended . This will be your starting position.
2. Leaning forward slightly, pull on the belt to draw the toes of your foot back. Hold this position for 10-20 seconds and then repeat with the other leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Head Harness Neck Resistance',
  'neck - strength',
  '1. Place a neck strap on the floor at the end of a flat bench. Once you have selected the weights, sit at the end of the flat bench with your feet wider than shoulder width apart from each other. Your toes should be pointed out.
2. Slowly move your torso forward until it is almost parallel with the floor. Using both hands, securely position the neck strap around your head. Tip: Make sure the weights are still lying on the floor to prevent any strain on the neck. Now grab the weight with both hands while elevating your torso back until it is almost perpendicular to the floor. Note: Your head and torso needs to be slightly tilted forward to perform this exercise.
3. Now place both hands on top of your knees. This is the starting position.
4. Slowly lower your neck down until your chin touches the upper part of your chest while breathing in.
5. While exhaling, bring your neck back to the starting position.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Trapézio' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Leg Curl',
  'hamstrings - strength',
  '1. Adjust the machine lever to fit your height and sit on the machine with your back against the back support pad.
2. Place the back of lower leg on top of padded lever (just a few inches under the calves) and secure the lap pad against your thighs, just above the knees. Then grasp the side handles on the machine as you point your toes straight (or you can also use any of the other two stances) and ensure that the legs are fully straight right in front of you. This will be your starting position.
3. As you exhale, pull the machine lever as far as possible to the back of your thighs by flexing at the knees. Keep your torso stationary at all times. Hold the contracted position for a second.
4. Slowly return to the starting position as you breathe in.
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
  'Seated Leg Tucks',
  'abdominals - strength',
  '1. Sit on a bench with the legs stretched out in front of you slightly below parallel and your arms holding on to the sides of the bench. Your torso should be leaning backwards around a 45-degree angle from the bench. This will be your starting position.
2. Bring the knees in toward you as you move your torso closer to them at the same time. Breathe out as you perform this movement.
3. After a second pause, go back to the starting position as you inhale.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated One-Arm Dumbbell Palms-Down Wrist Curl',
  'forearms - strength',
  '1. Sit on a flat bench with a dumbbell in your right hand.
2. Place your feet flat on the floor, at a distance that is slightly wider than shoulder width apart.
3. Lean forward and place your right forearm on top of your upper right thigh with your palm down. Tip: Make sure that the back of the wrist lies on top of your knees. This will be your starting position.
4. Lower the dumbbell as far as possible as you keep a tight grip on the dumbbell. Inhale as you perform this movement.
5. Now curl the dumbbell as high as possible as you contract the forearms and as you exhale. Keep the contraction for a second before you lower again. Tip: The only movement should happen at the wrist.
6. Perform for the recommended amount of repetitions, switch arms and repeat the movement.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Antebraço' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated One-Arm Dumbbell Palms-Up Wrist Curl',
  'forearms - strength',
  '1. Sit on a flat bench with a dumbbell in your right hand.
2. Place your feet flat on the floor, at a distance that is slightly wider than shoulder width apart.
3. Lean forward and place your right forearm on top of your upper right thigh with your palm up. Tip: Make sure that the front of the wrist lies on top of your knees. This will be your starting position.
4. Lower the dumbbell as far as possible as you keep a tight grip on the dumbbell. Inhale as you perform this movement.
5. Now curl the dumbbell as high as possible as you contract the forearms and as you exhale. Keep the contraction for a second before you lower again. Tip: The only movement should happen at the wrist.
6. Perform for the recommended amount of repetitions, switch arms and repeat the movement.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Antebraço' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated One-arm Cable Pulley Rows',
  'middle back - strength',
  '1. To get into the starting position, first sit down on the machine and place your feet on the front platform or crossbar provided making sure that your knees are slightly bent and not locked.
2. Lean over as you keep the natural alignment of your back and grab the single handle attachment with your left arm using a palms-down grip.
3. With your arm extended pull back until your torso is at a 90-degree angle from your legs. Your back should be slightly arched and your chest should be sticking out. You should be feeling a nice stretch on your lat as you hold the bar in front of you. The right arm can be kept by the waist. This is the starting position of the exercise.
4. Keeping the torso stationary, pull the handles back towards your torso while keeping the arms close to it as you rotate the wrist, so that by the time your hand is by your abdominals it is in a neutral position (palms facing the torso). Breathe out as you perform that movement. At that point you should be squeezing your back muscles hard.
5. Hold that contraction for a second and slowly go back to the original position while breathing in. Tip: Remember to rotate the wrist as you go back to the starting position so that the palms are facing down again.
6. Repeat for the recommended amount of repetitions and then perform the same movement with the right hand.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Overhead Stretch',
  'abdominals - stretching',
  '1. Sit up straight on an exercise mat.
2. Touch the soles of your feet together with your feet six to eight inches in front of your hips.
3. Place one hand on the floor beside you and your other hand behind your head.
4. Lift your elbow to the ceiling as you incline your torso to the other side. Hold for 10 to 20 seconds, then switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Palm-Up Barbell Wrist Curl',
  'forearms - strength',
  '1. Hold a barbell with both hands and your palms facing up; hands spaced about shoulder width.
2. Place your feet flat on the floor, at a distance that is slightly wider than shoulder width apart.
3. Lean forward and place your forearms on top of your upper thighs with your palms up. Tip: Make sure that the front of the wrists lay on top of your knees. This will be your starting position.
4. Lower the bar as far as possible while inhaling and keeping a tight grip.
5. Now curl bar up as high as possible while flexing the forearms and exhaling. Hold the contraction at the top for a second and Tip: Only the wrist should move.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Antebraço' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Palms-Down Barbell Wrist Curl',
  'forearms - strength',
  '1. Hold a barbell with both hands and your palms facing down; hands spaced about shoulder width.
2. Place your feet flat on the floor, at a distance that is slightly wider than shoulder width apart.
3. Lean forward and place your forearms on top of your upper thighs with your palms down. Tip: Make sure that the back of the wrists lay on top of your knees. This will be your starting position.
4. Lower the bar as far as possible while inhaling and keeping a tight grip.
5. Now curl bar up as high as possible while flexing the forearms and exhaling. Hold the contraction at the top for a second and Tip: Only the wrist should move.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Antebraço' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Side Lateral Raise',
  'shoulders - strength',
  '1. Pick a couple of dumbbells and sit at the end of a flat bench with your feet firmly on the floor. Hold the dumbbells with your palms facing in and your arms straight down at your sides at arms'' length. This will be your starting position.
2. While maintaining the torso stationary (no swinging), lift the dumbbells to your side with a slight bend on the elbow and the hands slightly tilted forward as if pouring water in a glass. Continue to go up until you arms are parallel to the floor. Exhale as you execute this movement and pause for a second at the top.
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
  'Seated Triceps Press',
  'triceps - strength',
  '1. Sit down on a bench with back support and grasp a dumbbell with both hands and hold it overhead at arm''s length. Tip: a better way is to have somebody hand it to you especially if it is very heavy. The resistance should be resting in the palms of your hands with your thumbs around it. The palm of the hand should be facing inward. This will be your starting position.
2. Keeping your upper arms close to your head (elbows in) and perpendicular to the floor, lower the resistance in a semi-circular motion behind your head until your forearms touch your biceps. Tip: The upper arms should remain stationary and only the forearms should move. Breathe in as you perform this step.
3. Go back to the starting position by using the triceps to raise the dumbbell. Breathe out as you perform this step.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Seated Two-Arm Palms-Up Low-Pulley Wrist Curl',
  'forearms - strength',
  '1. Put a bench in front of a low pulley machine that has a barbell or EZ Curl attachment on it.
2. Move the bench far enough away so that when you bring the handle to the top of your thighs tension is created on the cable due to the weight stack being moved up.
3. Now hold the handle with both hands, palms up, using a shoulder-width grip.
4. Step back and sit on the bench with your feet about shoulder width apart, firmly on the floor.
5. Lean forward and place the forearms on your thighs with the back of your wrists over your knees. This will be your starting position.
6. Lower the bar as far as possible, while inhaling and keeping a tight grip.
7. Now curl the bar up as high as possible while contracting the forearms. Tip: Only the wrist should move; not the forearms.
8. After a second contraction at the top go back to the starting position as you inhale.
9. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Antebraço' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'See-Saw Press (Alternating Side Press)',
  'shoulders - strength',
  '1. Grab a dumbbell with each hand and stand up erect.
2. Clean (lift) the dumbbells to the chest/shoulder level and then rotate your wrists so that your palms are facing towards you as if you were getting ready to perform an Arnold Press. This will be your starting position.
3. Now start extending your left arm overhead as you rotate the wrist so that the palm of your hand faces forward as you go up. Your elbows should come out also as you lift the weight. Simultaneously, you will also be bending from your hip to your opposite side. Tip: If you perform the exercise correctly, is should look as if you are trying to reach for something overhead on the right hand side of your body, but with your left arm. Breathe out as you perform this movement.
4. Once you reach the top position breathe in. Then, with the weight fully extended overhead and you bent over to your right hand side, begin the movement to the left side.
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
  'Shotgun Row',
  'lats - strength',
  '1. Attach a single handle to a low cable.
2. After selecting the correct weight, stand a couple feet back with a wide-split stance. Your arm should be extended and your shoulder forward. This will be your starting position.
3. Perform the movement by retracting the shoulder and flexing the elbow. As you pull, supinate the wrist, turning the palm upward as you go.
4. After a brief pause, return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Shoulder Circles',
  'shoulders - stretching',
  '1. With shoulders relaxed and arms resting loosely at your sides (or in your lap if you''re seated), gently roll your shoulders forward, up, back, and down.
2. Reverse direction. You can do this exercise alternating shoulders or both at the same time.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Shoulder Press - With Bands',
  'shoulders - strength',
  '1. To begin, stand on an exercise band so that tension begins at arm''s length. Grasp the handles and lift them so that the hands are at shoulder height at each side.
2. Rotate the wrists so that the palms of your hands are facing forward. Your elbows should be bent, with the upper arms and forearms in line to the torso. This is your starting position.
3. As you exhale, lift the handles up until your arms are fully extended overhead.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Elástico/Banda' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Shoulder Raise',
  'shoulders - stretching',
  '1. Relax your arms to your sides and raise your shoulders up toward your ears, then back down.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Shoulder Stretch',
  'shoulders - stretching',
  '1. Reach your left arm across your body and hold it straight.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
