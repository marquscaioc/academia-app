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
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dumbbell Alternate Bicep Curl',
  'biceps - strength',
  '1. Stand (torso upright) with a dumbbell in each hand held at arms length. The elbows should be close to the torso and the palms of your hand should be facing your thighs.
2. While holding the upper arm stationary, curl the right weight as you rotate the palm of the hands until they are facing forward. At this point continue contracting the biceps as you breathe out until your biceps is fully contracted and the dumbbells are at shoulder level. Hold the contracted position for a second as you squeeze the biceps. Tip: Only the forearms should move.
3. Slowly begin to bring the dumbbell back to the starting position as your breathe in. Tip: Remember to twist the palms back to the starting position (facing your thighs) as you come down.
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
  'Supino Reto com Halteres',
  'chest - strength',
  '1. Lie down on a flat bench with a dumbbell in each hand resting on top of your thighs. The palms of your hands will be facing each other.
2. Then, using your thighs to help raise the dumbbells up, lift the dumbbells one at a time so that you can hold them in front of you at shoulder width.
3. Once at shoulder width, rotate your wrists forward so that the palms of your hands are facing away from you. The dumbbells should be just to the sides of your chest, with your upper arm and forearm creating a 90 degree angle. Be sure to maintain full control of the dumbbells at all times. This will be your starting position.
4. Then, as you breathe out, use your chest to push the dumbbells up. Lock your arms at the top of the lift and squeeze your chest, hold for a second and then begin coming down slowly. Tip: Ideally, lowering the weight should take about twice as long as raising it.
5. Repeat the movement for the prescribed amount of repetitions of your training program.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dumbbell Bench Press with Neutral Grip',
  'chest - strength',
  '1. Take a dumbbell in each hand and lay back onto a flat bench. Your feet should be flat on the floor and your shoulder blades retracted.
2. Maintaining a neutral grip, palms facing each other, begin with your arms extended directly above you, perpendicular to the floor. This will be your starting position.
3. Begin the movement by flexing the elbow, lowering the upper arms to the side. Descend until the dumbbells are to your torso.
4. Pause, then extend the elbow and return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dumbbell Bicep Curl',
  'biceps - strength',
  '1. Stand up straight with a dumbbell in each hand at arm''s length. Keep your elbows close to your torso and rotate the palms of your hands until they are facing forward. This will be your starting position.
2. Now, keeping the upper arms stationary, exhale and curl the weights while contracting your biceps. Continue to raise the weights until your biceps are fully contracted and the dumbbells are at shoulder level. Hold the contracted position for a brief pause as you squeeze your biceps.
3. Then, inhale and slowly begin to lower the dumbbells back to the starting position.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dumbbell Clean',
  'hamstrings - strength',
  '1. Begin standing with a dumbbell in each hand with your feet shoulder width apart.
2. Lower the weights to the floor by flexing at the hips and knees, pushing your hips back until the dumbbells reach the floor. This will be your starting position.
3. To initiate the movement, violently jump upward by extending the hips, knees, and ankles to acclerate the weights upward. Maintaining a neutral grip on the dumbbells, keep the arms straight until full extension is reached.
4. After full extension, rebend the hips and knees to receive the weight in a squat position. Allow the arms to bend, guiding the dumbbells to your shoulders.
5. Upon receiving the weight in the squat position, extend the hips and knees to finish in a standing position with the weights on your shoulders.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dumbbell Floor Press',
  'triceps - powerlifting',
  '1. Lay on the floor holding dumbbells in your hands. Your knees can be bent. Begin with the weights fully extended above you.
2. Lower the weights until your upper arm comes in contact with the floor. You can tuck your elbows to emphasize triceps size and strength, or to focus on your chest angle your arms to the side.
3. Pause at the bottom, and then bring the weight together at the top by extending through the elbows.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dumbbell Flyes',
  'chest - strength',
  '1. Lie down on a flat bench with a dumbbell on each hand resting on top of your thighs. The palms of your hand will be facing each other.
2. Then using your thighs to help raise the dumbbells, lift the dumbbells one at a time so you can hold them in front of you at shoulder width with the palms of your hands facing each other. Raise the dumbbells up like you''re pressing them, but stop and hold just before you lock out. This will be your starting position.
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
  'Dumbbell Incline Row',
  'middle back - strength',
  '1. Using a neutral grip, lean into an incline bench.
2. Take a dumbbell in each hand with a neutral grip, beginning with the arms straight. This will be your starting position.
3. Retract the shoulder blades and flex the elbows to row the dumbbells to your side.
4. Pause at the top of the motion, and then return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dumbbell Incline Shoulder Raise',
  'shoulders - strength',
  '1. Sit on an Incline Bench while holding a dumbbell on each hand on top of your thighs.
2. Lift your legs up to kick the weights to your shoulders and lean back. Position the dumbbells above your shoulders with your arms extended. The arms should be perpendicular to the floor with your palms facing forward and knuckles pointing towards the ceiling. This will be your starting position.
3. While keeping the arms straight and locked, lift the dumbbells by raising the shoulders from the bench as you breathe out.
4. Bring back the dumbbells to the starting position as you breathe in.
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
  'Dumbbell Lunges',
  'quadriceps - strength',
  '1. Stand with your torso upright holding two dumbbells in your hands by your sides. This will be your starting position.
2. Step forward with your right leg around 2 feet or so from the foot being left stationary behind and lower your upper body down, while keeping the torso upright and maintaining balance. Inhale as you go down. Note: As in the other exercises, do not allow your knee to go forward beyond your toes as you come down, as this will put undue stress on the knee joint. Make sure that you keep your front shin perpendicular to the ground.
3. Using mainly the heel of your foot, push up and go back to the starting position as you exhale.
4. Repeat the movement for the recommended amount of repetitions and then perform with the left leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dumbbell Lying One-Arm Rear Lateral Raise',
  'shoulders - strength',
  '1. While holding a dumbbell in one hand, lay with your chest down on a slightly inclined (around 15 degrees when measured from the floor) adjustable bench. The other hand can be used to hold to the leg of the bench for stability.
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
  'Dumbbell Lying Pronation',
  'forearms - strength',
  '1. Lie on a flat bench face down with one arm holding a dumbbell and the other hand on top of the bench folded so that you can rest your head on it.
2. Bend the elbows of the arm holding the dumbbell so that it creates a 90-degree angle between the upper arm and the forearm.
3. Now raise the upper arm so that the forearm is perpendicular to the floor and the upper arm is perpendicular to your torso. Tip: The upper arm should be parallel to the floor and also creating a 90-degree angle with your torso. This will be your starting position.
4. As you breathe out, externally rotate your forearm so that the dumbbell is lifted forward as you maintain the 90 degree angle bend between the upper arms and the forearm. You will continue this external rotation until the forearm is parallel to the floor. At this point you will hold the contraction for a second.
5. As you breathe in, slowly go back to the starting position.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Antebraço' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dumbbell Lying Rear Lateral Raise',
  'shoulders - strength',
  '1. While holding a dumbbell in each hand, lay with your chest down on a slightly inclined (around 15 degrees when measured from the floor) adjustable bench.
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
  'Dumbbell Lying Supination',
  'forearms - strength',
  '1. Lie sideways on a flat bench with one arm holding a dumbbell and the other hand on top of the bench folded so that you can rest your head on it.
2. Bend the elbows of the arm holding the dumbbell so that it creates a 90-degree angle between the upper arm and the forearm.
3. Now raise the upper arm so that the forearm is parallel to the floor and perpendicular to your torso (Tip: So the forearm will be directly in front of you). The upper arm will be stationary by your torso and should be parallel to the floor (aligned with your torso at all times). This will be your starting position.
4. As you breathe out, externally rotate your forearm so that the dumbbell is lifted up in a semicircle motion as you maintain the 90 degree angle bend between the upper arms and the forearm. You will continue this external rotation until the forearm is perpendicular to the floor and the torso pointing towards the ceiling. At this point you will hold the contraction for a second.
5. As you breathe in, slowly go back to the starting position.
6. Repeat for the recommended amount of repetitions and then switch to the other arm.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Antebraço' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dumbbell One-Arm Shoulder Press',
  'shoulders - strength',
  '1. Grab a dumbbell and either sit on a military press bench or a utility bench that has a back support on it as you place the dumbbells upright on top of your thighs or stand up straight.
2. Clean the dumbbell up to bring it to shoulder height. The other hand can be kept fully extended to the side, by the waist or grabbing a fixed surface.
3. Rotate the wrist so that the palm of your hand is facing forward. This is your starting position.
4. As you exhale, push the dumbbell up until your arm is fully extended.
5. After a second pause, slowly come down back to the starting position as you inhale.
6. Repeat for the recommended amount of repetitions and then switch arms.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dumbbell One-Arm Triceps Extension',
  'triceps - strength',
  '1. Grab a dumbbell and either sit on a military press bench or a utility bench that has a back support on it as you place the dumbbells upright on top of your thighs or stand up straight.
2. Clean the dumbbell up to bring it to shoulder height and then extend the arm over your head so that the whole arm is perpendicular to the floor and next to your head. The dumbbell should be on top of you. The other hand can be kept fully extended to the side, by the waist, supporting the upper arm that has the dumbbell or grabbing a fixed surface.
3. Rotate the wrist so that the palm of your hand is facing forward and the pinkie is facing the ceiling. This will be your starting position.
4. Slowly lower the dumbbell behind your head as you hold the upper arm stationary. Inhale as you perform this movement and pause when your triceps are fully stretched.
5. Return to the starting position by flexing your triceps as you breathe out. Tip: It is imperative that only the forearm moves. The upper arm should remain at all times stationary next to your head.
6. Repeat for the recommended amount of repetitions and switch arms.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dumbbell One-Arm Upright Row',
  'shoulders - strength',
  '1. Grab a dumbbell and stand up straight with your arm extended in front of you with a slight bend at the elbows and your back straight. This will be your starting position. Tip: The dumbbell should be resting on top of your thigh with the palm of your hands facing your thighs.
2. Keep the other hand can be kept fully extended to the side, by the waist or grabbing a fixed surface. This will be your starting position.
3. Use your side shoulders to lift the dumbbell as you exhale. The dumbbell should be close to the body as you move it up. Continue to lift it until the dumbbell is nearly in line with your chin. Tip: Your elbows should drive the motion. As you lift the dumbbell, your elbow should always be higher than your forearm. Also, keep your torso stationary and pause for a second at the top of the movement.
4. Lower the dumbbell back down slowly to the starting position. Inhale as you perform this portion of the movement.
5. Repeat for the recommended amount of repetitions and switch arms.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dumbbell Prone Incline Curl',
  'biceps - strength',
  '1. Grab a dumbbell on each hand and lie face down on an incline bench with your shoulders near top of the incline. Your knees can rest on the seat or your legs can be straddled to the sides (my preferred way).
2. Let your arms extend and hang naturally in front of you so that they are perpendicular to the floor.
3. Now keep your elbows in by your side and face the palms forward. This will be your starting position.
4. Raise the dumbbells by contracting the biceps until your arms are fully flexed. Exhale as you perform this portion of the movement and ensure that only the forearms move. The upper arms should remain stationary at all times.
5. Lower the dumbbells until your arms are fully extended.
6. Repeat for the recommended amount of times.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dumbbell Raise',
  'shoulders - strength',
  '1. Grab a dumbbell in each arm and stand up straight with your arms extended by your sides with a slight bend at the elbows and your back straight. This will be your starting position. Tip: The dumbbell should be next to your thighs with the palm of your hands facing back.
2. Use your side shoulders to lift the dumbbells as you exhale. The dumbbells should be to the side of the body as you move them up. Continue to lift it until the dumbbells are nearly in line with your chin. Tip: Your elbows should drive the motion. As you lift the dumbbell, your elbow should always be higher than your forearm. Also, keep your torso stationary and pause for a second at the top of the movement.
3. Lower the dumbbells back down slowly to the starting position. Inhale as you perform this portion of the movement.
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
  'Dumbbell Rear Lunge',
  'quadriceps - strength',
  '1. Stand with your torso upright holding two dumbbells in your hands by your sides. This will be your starting position.
2. Step backward with your right leg around two feet or so from the left foot and lower your upper body down, while keeping the torso upright and maintaining balance. Inhale as you go down. Tip: As in the other exercises, do not allow your knee to go forward beyond your toes as you come down, as this will put undue stress on the knee joint. Make sure that you keep your front shin perpendicular to the ground. Keep the torso upright during the lunge; flexible hip flexors are important. A long lunge emphasizes the Gluteus Maximus; a short lunge emphasizes Quadriceps.
3. Push up and go back to the starting position as you exhale. Tip: Use the ball of your feet to push in order to accentuate the quadriceps. To focus on the glutes, press with your heels.
4. Now repeat with the opposite leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dumbbell Scaption',
  'shoulders - strength',
  '1. This corrective exercise strengthens the muscles that stabilize your shoulder blade. Hold a light weight in each hand, hanging at your sides. Your thumbs should pointing up.
2. Begin the movement raising your arms out in front of you, about 30 degrees off center. Your arms should be fully extended as you perform the movement.
3. Continue until your arms are parallel to the ground, and then return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dumbbell Seated Box Jump',
  'quadriceps - plyometrics',
  '1. Position a box a couple feet to the side of a bench. Hold a dumbbell to your chest with both hands and seat yourself on the bench facing the box. This will be your starting position.
2. Plant your feet firmly on the ground as you lean forward, extending through the hips and knees to jump up and forward.
3. Land on the box with both feet, absorbing the impact by allowing the hips and knees to bend.
4. Step down and return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dumbbell Seated One-Leg Calf Raise',
  'calves - strength',
  '1. Place a block on the floor about 12 inches from a flat bench.
2. Sit on a flat bench and place a dumbbell on your upper left thigh about 3 inches above your knee.
3. Now place the ball of your left foot on the block. This will be your starting position.
4. Raise your toes up as high as possible as you exhale and you contract your calf muscle. Hold the contraction for a second.
5. Slowly return to the starting position, stretching as far down as possible.
6. Repeat for your prescribed number of repetitions and then repeat with the right leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Panturrilha' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dumbbell Shoulder Press',
  'shoulders - strength',
  '1. While holding a dumbbell in each hand, sit on a military press bench or utility bench that has back support. Place the dumbbells upright on top of your thighs.
2. Now raise the dumbbells to shoulder height one at a time using your thighs to help propel them up into position.
3. Make sure to rotate your wrists so that the palms of your hands are facing forward. This is your starting position.
4. Now, exhale and push the dumbbells upward until they touch at the top.
5. Then, after a brief pause at the top contracted position, slowly lower the weights back down to the starting position while inhaling.
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
  'Dumbbell Shrug',
  'traps - strength',
  '1. Stand erect with a dumbbell on each hand (palms facing your torso), arms extended on the sides.
2. Lift the dumbbells by elevating the shoulders as high as possible while you exhale. Hold the contraction at the top for a second. Tip: The arms should remain extended at all times. Refrain from using the biceps to help lift the dumbbells. Only the shoulders should be moving up and down.
3. Lower the dumbbells back to the original position.
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
  'Dumbbell Side Bend',
  'abdominals - strength',
  '1. Stand up straight while holding a dumbbell on the left hand (palms facing the torso) as you have the right hand holding your waist. Your feet should be placed at shoulder width. This will be your starting position.
2. While keeping your back straight and your head up, bend only at the waist to the right as far as possible. Breathe in as you bend to the side. Then hold for a second and come back up to the starting position as you exhale. Tip: Keep the rest of the body stationary.
3. Now repeat the movement but bending to the left instead. Hold for a second and come back to the starting position.
4. Repeat for the recommended amount of repetitions and then change hands.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dumbbell Squat',
  'quadriceps - strength',
  '1. Stand up straight while holding a dumbbell on each hand (palms facing the side of your legs).
2. Position your legs using a shoulder width medium stance with the toes slightly pointed out. Keep your head up at all times as looking down will get you off balance and also maintain a straight back. This will be your starting position. Note: For the purposes of this discussion we will use the medium stance described above which targets overall development; however you can choose any of the three stances discussed in the foot stances section.
3. Begin to slowly lower your torso by bending the knees as you maintain a straight posture with the head up. Continue down until your thighs are parallel to the floor. Tip: If you performed the exercise correctly, the front of the knees should make an imaginary straight line with the toes that is perpendicular to the front. If your knees are past that imaginary line (if they are past your toes) then you are placing undue stress on the knee and the exercise has been performed incorrectly.
4. Begin to raise your torso as you exhale by pushing the floor with the heel of your foot mainly as you straighten the legs again and go back to the starting position.
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
  'Dumbbell Squat To A Bench',
  'quadriceps - strength',
  '1. Stand up straight with a flat bench behind you while holding a dumbbell on each hand (palms facing the side of your legs).
2. Position your legs using a shoulder width medium stance with the toes slightly pointed out. Keep your head up at all times as looking down will get you off balance and also maintain a straight back. This will be your starting position. Note: For the purposes of this discussion we will use the medium stance described above which targets overall development; however you can choose any of the three stances discussed in the foot stances section.
3. Begin to slowly lower your torso by bending the knees as you maintain a straight posture with the head up. Continue down until you slightly touch the bench behind you. Inhale as you perform this portion of the movement. Tip: If you performed the exercise correctly, the front of the knees should make an imaginary straight line with the toes that is perpendicular to the front. If your knees are past that imaginary line (if they are past your toes) then you are placing undue stress on the knee and the exercise has been performed incorrectly.
4. Begin to raise the bar as you exhale by pushing the floor with the heel of your foot mainly as you straighten the legs again and go back to the starting position.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dumbbell Step Ups',
  'quadriceps - strength',
  '1. Stand up straight while holding a dumbbell on each hand (palms facing the side of your legs).
2. Place the right foot on the elevated platform. Step on the platform by extending the hip and the knee of your right leg. Use the heel mainly to lift the rest of your body up and place the foot of the left leg on the platform as well. Breathe out as you execute the force required to come up.
3. Step down with the left leg by flexing the hip and knee of the right leg as you inhale. Return to the original standing position by placing the right foot of to next to the left foot on the initial position.
4. Repeat with the right leg for the recommended amount of repetitions and then perform with the left leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dumbbell Tricep Extension -Pronated Grip',
  'triceps - strength',
  '1. Lie down on a flat bench holding two dumbbells directly above your shoulders. Your arms should be fully extended and form a 90 degree angle from your torso and the floor.
2. The palms of your hands should be facing forward, and your elbows should be tucked in. This will be your starting position.
3. Now, inhale and slowly lower the dumbbells until they are near your ears. Be sure to keep your upper arms stationary and your elbows tucked in.
4. Then, exhale and use your triceps to return the weight to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dynamic Back Stretch',
  'lats - stretching',
  '1. Stand with your feet shoulder width apart. This will be your starting position.
2. Keeping your arms straight, swing them straight up in front of you 5-10 times, increasing the range of motion each time until your arms are above your head.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Dynamic Chest Stretch',
  'chest - stretching',
  '1. Stand with your hands together, arms extended directly in front of you. This will be your starting position.
2. Keeping your arms straight, quickly move your arms back as far as possible and back in again, similar to an exaggerated clapping motion. Repeat 5-10 times, increasing speed as you do so.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'EZ-Bar Curl',
  'biceps - strength',
  '1. Stand up straight while holding an EZ curl bar at the wide outer handle. The palms of your hands should be facing forward and slightly tilted inward due to the shape of the bar. Keep your elbows close to your torso. This will be your starting position.
2. Now, while keeping your upper arms stationary, exhale and curl the weights forward while contracting the biceps. Focus on only moving your forearms.
3. Continue to raise the weight until your biceps are fully contracted and the bar is at shoulder level. Hold the top contracted position for a moment and squeeze the biceps.
4. Then inhale and slowly lower the bar back to the starting position.
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
  'EZ-Bar Skullcrusher',
  'triceps - strength',
  '1. Using a close grip, lift the EZ bar and hold it with your elbows in as you lie on the bench. Your arms should be perpendicular to the floor. This will be your starting position.
2. Keeping the upper arms stationary, lower the bar by allowing the elbows to flex. Inhale as you perform this portion of the movement. Pause once the bar is directly above the forehead.
3. Lift the bar back to the starting position by extending the elbow and exhaling.
4. Repeat.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Elbow Circles',
  'shoulders - stretching',
  '1. Sit or stand with your feet slightly apart.
2. Place your hands on your shoulders with your elbows at shoulder level and pointing out.
3. Slowly make a circle with your elbows. Breathe out as you start the circle and breathe in as you complete the circle.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Elbow to Knee',
  'abdominals - strength',
  '1. Lie on the floor, crossing your right leg across your bent left knee. Clasp your hands behind your head, beginning with your shoulder blades on the ground. This will be your starting position.
2. Perform the motion by flexing the spine and rotating your torso to bring the left elbow to the right knee.
3. Return to the starting position and repeat the movement for the desired number of repetitions before switching sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Elbows Back',
  'chest - stretching',
  '1. Stand up straight.
2. Place both hands on your lower back, fingers pointing downward and elbows out.
3. Then gently pull your elbows back aiming to touch them together.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Elevated Back Lunge',
  'quadriceps - strength',
  '1. Position a bar onto a rack at shoulder height loaded to an appropriate weight. Place a short, raised platform behind you.
2. Rack the bar onto your upper back, keeping your back arched and tight. Step onto your raised platform with both feet. This will be your starting position.
3. Begin by stepping backwards with one leg. Descend by flexing your hips and knees until your knee touches the floor.
4. Pause, and extend through the hips and knees to rise up, returning all the way to the starting position before alternating.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Elevated Cable Rows',
  'lats - strength',
  '1. Get a platform of some sort (it can be an aerobics or calf raise platform) that is around 4-6 inches in height.
2. Place it on the seat of the cable row machine.
3. Sit down on the machine and place your feet on the front platform or crossbar provided making sure that your knees are slightly bent and not locked.
4. Lean over as you keep the natural alignment of your back and grab the V-bar handles.
5. With your arms extended pull back until your torso is at a 90-degree angle from your legs. Your back should be slightly arched and your chest should be sticking out. You should be feeling a nice stretch on your lats as you hold the bar in front of you. This is the starting position of the exercise.
6. Keeping the torso stationary, pull the handles back towards your torso while keeping the arms close to it until you touch the abdominals. Breathe out as you perform that movement. At that point you should be squeezing your back muscles hard. Hold that contraction for a second and slowly go back to the original position while breathing in.
7. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Elliptical Trainer',
  'quadriceps - cardio',
  '1. To begin, step onto the elliptical and select the desired option from the menu. Most ellipticals have a manual setting, or you can select a program to run. Typically, you can enter your age and weight to estimate the amount of calories burned during exercise. Elevation can be adjusted to change the intensity of the workout.
2. The handles can be used to monitor your heart rate to help you stay at an appropriate intensity.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'intermediate',
  'cardio',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Exercise Ball Crunch',
  'abdominals - strength',
  '1. Lie on an exercise ball with your lower back curvature pressed against the spherical surface of the ball. Your feet should be bent at the knee and pressed firmly against the floor. The upper torso should be hanging off the top of the ball. The arms should either be kept alongside the body or crossed on top of your chest as these positions avoid neck strains (as opposed to the hands behind the back of the head position).
2. Lower your torso into a stretch position keeping the neck stationary at all times. This will be your starting position.
3. With the hips stationary, flex the waist by contracting the abdominals and curl the shoulders and trunk upward until you feel a nice contraction on your abdominals. The arms should simply slide up the side of your legs if you have them at the side or just stay on top of your chest if you have them crossed. The lower back should always stay in contact with the ball. Exhale as you perform this movement and hold the contraction for a second.
4. As you inhale, go back to the starting position.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Exercise Ball Pull-In',
  'abdominals - strength',
  '1. Place an exercise ball nearby and lay on the floor in front of it with your hands on the floor shoulder width apart in a push-up position.
2. Now place your lower shins on top of an exercise ball. Tip: At this point your legs should be fully extended with the shins on top of the ball and the upper body should be in a push-up type of position being supported by your two extended arms in front of you. This will be your starting position.
3. While keeping your back completely straight and the upper body stationary, pull your knees in towards your chest as you exhale, allowing the ball to roll forward under your ankles. Squeeze your abs and hold that position for a second.
4. Now slowly straighten your legs, rolling the ball back to the starting position as you inhale.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Extended Range One-Arm Kettlebell Floor Press',
  'chest - strength',
  '1. Lie on the floor and position a kettlebell for one arm to press. The kettlebell should be held by the handle. The leg on the same side that you are pressing should be bent, with the knee crossing over the midline of the body.
2. Press the kettlebell by extending the elbow and adducting the arm, pressing it above your body. Return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'External Rotation',
  'shoulders - strength',
  '1. Lie sideways on a flat bench with one arm holding a dumbbell and the other hand on top of the bench folded so that you can rest your head on it.
2. Bend the elbows of the arm holding the dumbbell so that it creates a 90-degree angle between the upper arm and the forearm. Tip: Keep the arm parallel to your torso.
3. Now bend the elbow while keeping the upper arm stationary. In this manner, the forearm will be parallel to the floor and perpendicular to your torso (Tip: So the forearm will be directly in front of you). The upper arm will be stationary by your torso and should be parallel to the floor (aligned with your torso at all times). This will be your starting position.
4. As you breathe out, externally rotate your forearm so that the dumbbell is lifted up in a semicircle motion as you maintain the 90 degree angle bend between the upper arms and the forearm. You will continue this external rotation until the forearm is perpendicular to the floor and the torso pointing towards the ceiling. At this point you will hold the contraction for a second.
5. As you breathe in, slowly go back to the starting position.
6. Repeat for the recommended amount of repetitions and then switch to the other arm.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'External Rotation with Band',
  'shoulders - strength',
  '1. Choke the band around a post. The band should be at the same height as your elbow. Stand with your left side to the band a couple of feet away.
2. Grasp the end of the band with your right hand, and keep your elbow pressed firmly to your side. We recommend you hold a pad or foam roll in place with your elbow to keep it firmly in position.
3. With your upper arm in position, your elbow should be flexed to 90 degrees with your hand reaching across the front of your torso. This will be your starting position.
4. Execute the movement by rotating your arm in a backhand motion, keeping your elbow in place.
5. Continue as far as you are able, pause, and then return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Elástico/Banda' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'External Rotation with Cable',
  'shoulders - strength',
  '1. Adjust the cable to the same height as your elbow. Stand with your left side to the band a couple of feet away.
2. Grasp the handle with your right hand, and keep your elbow pressed firmly to your side. We recommend you hold a pad or foam roll in place with your elbow to keep it firmly in position.
3. With your upper arm in position, your elbow should be flexed to 90 degrees with your hand reaching across the front of your torso. This will be your starting position.
4. Execute the movement by rotating your arm in a backhand motion, keeping your elbow in place.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Face Pull',
  'shoulders - strength',
  '1. Facing a high pulley with a rope or dual handles attached, pull the weight directly towards your face, separating your hands as you do so. Keep your upper arms parallel to the ground.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Farmer''s Walk',
  'forearms - strongman',
  '1. There are various implements that can be used for the farmers walk. These can also be performed with heavy dumbbells or short bars if these implements aren''t available. Begin by standing between the implements.
2. After gripping the handles, lift them up by driving through your heels, keeping your back straight and your head up.
3. Walk taking short, quick steps, and don''t forget to breathe. Move for a given distance, typically 50-100 feet, as fast as possible.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Antebraço' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Fast Skipping',
  'quadriceps - plyometrics',
  '1. Start in a relaxed position with one leg slightly forward. This will be your starting position.
2. Skip by executing a step-hop pattern of right-right-step to left-left-step, and so on, alternating back and forth.
3. Perform fast skips by maintaining close contact with the ground and reduce air time, moving as quickly as possible.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Finger Curls',
  'forearms - strength',
  '1. Hold a barbell with both hands and your palms facing up; hands spaced about shoulder width.
2. Place your feet flat on the floor, at a distance that is slightly wider than shoulder width apart. This will be your starting position.
3. Lower the bar as far as possible by extending the fingers. Allowing the bar to roll down the hands, catch the bar with the final joint in the fingers.
4. Now curl bar up as high as possible by closing your hands while exhaling. Hold the contraction at the top.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Antebraço' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Flat Bench Cable Flyes',
  'chest - strength',
  '1. Position a flat bench between two low pulleys so that when you are laying on it, your chest will be lined up with the cable pulleys.
2. Lay flat on the bench and keep your feet on the ground.
3. Have someone hand you the handles on each hand. You will grab each single handle attachment with a palms up grip.
4. Extend your arms by your side with a slight bend on your elbows. Tip: You will keep this bend constant through the whole movement. Your arms should be parallel to the floor. This is your starting position.
5. Now start lifting the arms in a semi-circle motion directly in front of you by pulling the cables together until both hands meet at the top of the movement. Squeeze your chest as you perform this motion and breathe out during this movement. Also, hold the contraction for a second at the top. Tip: When performed correctly, at the top position of this movement, your arms should be perpendicular to your torso and the floor touching above your chest.
6. Slowly come back to the starting position.
7. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Flat Bench Leg Pull-In',
  'abdominals - strength',
  '1. Lie on an exercise mat or a flat bench with your legs off the end.
2. Place your hands either under your glutes with your palms down or by the sides holding on to the bench (or with palms down by the side on an exercise mat). Also extend your legs straight out. This will be your starting position.
3. Bend your knees and pull your upper thighs into your midsection as you breathe out. Continue this movement until your knees are near your chest. Hold the contracted position for a second.
4. As you breathe in, slowly return to the starting position.
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
  'Flat Bench Lying Leg Raise',
  'abdominals - strength',
  '1. Lie with your back flat on a bench and your legs extended in front of you off the end.
2. Place your hands either under your glutes with your palms down or by the sides holding on to the bench. This will be your starting position.
3. As you keep your legs extended, straight as possible with your knees slightly bent but locked raise your legs until they make a 90-degree angle with the floor. Exhale as you perform this portion of the movement and hold the contraction at the top for a second.
4. Now, as you inhale, slowly lower your legs back down to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Flexor Incline Dumbbell Curls',
  'biceps - strength',
  '1. Hold the dumbbell towards the side farther from you so that you have more weight on the side closest to you. (This can be done for a good effect on all bicep dumbbell exercises). Now do a normal incline dumbbell curl, but keep your wrists as far back as possible so as to neutralize any stress that is placed on them.
2. Sit on an incline bench that is angled at 45-degrees while holding a dumbbell on each hand.
3. Let your arms hang down on your sides, with the elbows in, and turn the palms of your hands forward with the thumbs pointing away from the body. Tip: You will keep this hand position throughout the movement as there should not be any twisting of the hands as they come up. This will be your starting position.
4. Curl up the two dumbbells at the same time until your biceps are fully contracted and exhale. Tip: Do not swing the arms or use momentum. Keep a controlled motion at all times. Hold the contracted position for a second at the top.
5. As you inhale, slowly go back to the starting position.
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
  'Floor Glute-Ham Raise',
  'hamstrings - strength',
  '1. You can use a partner for this exercise or brace your feet under something stable.
2. Begin on your knees with your upper legs and torso upright. If using a partner, they will firmly hold your feet to keep you in position. This will be your starting position.
3. Lower yourself by extending at the knee, taking care to NOT flex the hips as you go forward.
4. Place your hands in front of you as you reach the floor. This movement is very difficult and you may be unable to do it unaided. Use your arms to lightly push off the floor to aid your return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Floor Press',
  'triceps - powerlifting',
  '1. Adjust the j-hooks so they are at the appropriate height to rack the bar. Begin lying on the floor with your head near the end of a power rack. Keeping your shoulder blades pulled together; pull the bar off of the hooks.
2. Lower the bar towards the bottom of your chest or upper stomach, squeezing the bar and attempting to pull it apart as you do so. Ensure that you tuck your elbows throughout the movement. Lower the bar until your upper arm contacts the ground and pause, preventing any slamming or bouncing of the weight.
3. Press the bar back up as fast as you can, keeping the bar, your wrists, and elbows in line as you do so.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Floor Press with Chains',
  'triceps - powerlifting',
  '1. Adjust the j-hooks so they are at the appropriate height to rack the bar. For this exercise, drape the chains directly over the end of the bar, trying to keep the ends away from the plates.
2. Begin lying on the floor with your head near the end of a power rack. Keeping your shoulder blades pulled together, pull the bar off of the hooks.
3. Lower the bar towards the bottom of your chest or upper stomach, squeezing the bar and attempting to pull it apart as you do so. Ensure that you tuck your elbows throughout the movement. Lower the bar until your upper arm contacts the ground and pause, preventing any slamming or bouncing of the weight.
4. Press the bar back up as fast as you can, keeping the bar, your wrists, and elbows in line as you do so.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Flutter Kicks',
  'glutes - strength',
  '1. On a flat bench lie facedown with the hips on the edge of the bench, the legs straight with toes high off the floor and with the arms on top of the bench holding on to the front edge.
2. Squeeze your glutes and hamstrings and straighten the legs until they are level with the hips. This will be your starting position.
3. Start the movement by lifting the left leg higher than the right leg.
4. Then lower the left leg as you lift the right leg.
5. Continue alternating in this manner (as though you are doing a flutter kick in water) until you have done the recommended amount of repetitions for each leg. Make sure that you keep a controlled movement at all times. Tip: You will breathe normally as you perform this movement.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Foot-SMR',
  'calves - stretching',
  '1. This exercise stretches the fascia of the muscles in the feet. Start off seated with your shoes removed. Using a foot roller or a similar object, such as a small section of pvc pipe, place your foot against the roller across the arch of your foot. This will be your starting position.
2. Press down firmly, rolling across the arch of your foot. Hold for 10-30 seconds, and then switch feet.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Panturrilha' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Forward Drag with Press',
  'chest - strongman',
  '1. Attach a dual handled chain or rope attachment to the sled. You should be facing away from the sled, holding a handle in each hand.
2. Begin the movement by moving forward for one step. Leaning forward, extend through the legs and hips to move, pausing with each step to extend through the elbows, pressing your hands forward. Step forward until you return to the start position prepared to press.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Frankenstein Squat',
  'quadriceps - olympic weightlifting',
  '1. This drill teaches you the proper positioning of both the bar and your body during the clean and front squat.
2. Place the barbell on the front of the shoulders, releasing your grip and extending your arms out in front of you. The shoulders should be pushed forward to create a shelf, and the bar should be in contact with the throat. Ensure that you only move your shoulder blades forward; don''t round the thoracic spine.
3. Squat by flexing the knees and hips, sitting in between your legs. Keep the torso upright, the arms up, and the shoulders forward, and the bar should stay in place. Go to the bottom of the squat, until your hamstrings contact your calves.
4. Return to the upright position by driving through the front of the heel and extending the knees and hips.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Freehand Jump Squat',
  'quadriceps - strength',
  '1. Cross your arms over your chest.
2. With your head up and your back straight, position your feet at shoulder width.
3. Keeping your back straight and chest up, squat down as you inhale until your upper thighs are parallel, or lower, to the floor.
4. Now pressing mainly with the ball of your feet, jump straight up in the air as high as possible, using the thighs like springs. Exhale during this portion of the movement.
5. When you touch the floor again, immediately squat down and jump again.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Frog Hops',
  'quadriceps - stretching',
  '1. Stand with your hands behind your head, and squat down keeping your torso upright and your head up. This will be your starting position.
2. Jump forward several feet, avoiding jumping unnecessarily high. As your feet contact the ground, absorb the impact through your legs, and jump again. Repeat this action 5-10 times.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Frog Sit-Ups',
  'abdominals - strength',
  '1. Lie with your back flat on the floor (or exercise mat) and your legs extended in front of you.
2. Now bend at the knees and place your outer thighs by the floor (or mat) as you make the soles of your feet touch each other.
3. Now try pushing both soles and bringing them up as near you as possible while you keep the outer thighs on the floor (or at least almost touching it). Tip: In this position your legs should create a diamond shape.
4. Now, cross your arms in front of you by touching the opposite shoulders. This will be your starting position.
5. As you exhale flatten your lower back to the floor while curling the torso upwards. Tip: This will be like performing the first 1/4 movement of a sit up. Hold at the top position for a second.
6. As you inhale, slowly lower back to the starting position.
7. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Front Barbell Squat',
  'quadriceps - strength',
  '1. This exercise is best performed inside a squat rack for safety purposes. To begin, first set the bar on a rack that best matches your height. Once the correct height is chosen and the bar is loaded, bring your arms up under the bar while keeping the elbows high and the upper arm slightly above parallel to the floor. Rest the bar on top of the deltoids and cross your arms while grasping the bar for total control.
2. Lift the bar off the rack by first pushing with your legs and at the same time straightening your torso.
3. Step away from the rack and position your legs using a shoulder width medium stance with the toes slightly pointed out. Keep your head up at all times as looking down will get you off balance and also maintain a straight back. This will be your starting position. (Note: For the purposes of this discussion we will use the medium stance described above which targets overall development; however you can choose any of the three stances described in the foot positioning section).
4. Begin to slowly lower the bar by bending the knees as you maintain a straight posture with the head up. Continue down until the angle between the upper leg and the calves becomes slightly less than 90-degrees (which is the point in which the upper legs are below parallel to the floor). Inhale as you perform this portion of the movement. Tip: If you performed the exercise correctly, the front of the knees should make an imaginary straight line with the toes that is perpendicular to the front. If your knees are past that imaginary line (if they are past your toes) then you are placing undue stress on the knee and the exercise has been performed incorrectly.
5. Begin to raise the bar as you exhale by pushing the floor mainly with the middle of your foot as you straighten the legs again and go back to the starting position.
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
  'Front Barbell Squat To A Bench',
  'quadriceps - strength',
  '1. This exercise is best performed inside a squat rack for safety purposes. To begin, first set a flat bench behind you and set the bar on a rack that best matches your height. Once the correct height is chosen and the bar is loaded, bring your arms up under the bar while keeping the elbows high and the upper arm slightly above parallel to the floor. Rest the bar on top of the deltoids and cross your arms while grasping the bar for total control.
2. Lift the bar off the rack by first pushing with your legs and at the same time straightening your torso.
3. Step away from the rack and position your legs using a shoulder width medium stance with the toes slightly pointed out. Keep your head up at all times as looking down will get you off balance and also maintain a straight back. This will be your starting position. (Note: For the purposes of this discussion we will use the medium stance described above which targets overall development; however you can choose any of the three stances described in the foot positioning section).
4. Begin to slowly lower the bar by bending the knees as you maintain a straight posture with the head up. Continue down until you touch the bench with your glutes. Inhale as you perform this portion of the movement. Tip: If you performed the exercise correctly, the front of the knees should make an imaginary straight line with the toes that is perpendicular to the front. If your knees are past that imaginary line (if they are past your toes) then you are placing undue stress on the knee and the exercise has been performed incorrectly.
5. Begin to raise the bar as you exhale by pushing the floor mainly with the heel of your foot as you straighten the legs again and go back to the starting position.
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
  'Front Box Jump',
  'hamstrings - plyometrics',
  '1. Begin with a box of an appropriate height 1-2 feet in front of you. Stand with your feet should width apart. This will be your starting position.
2. Perform a short squat in preparation for jumping, swinging your arms behind you.
3. Rebound out of this position, extending through the hips, knees, and ankles to jump as high as possible. Swing your arms forward and up.
4. Land on the box with the knees bent, absorbing the impact through the legs. You can jump from the box back to the ground, or preferably step down one leg at a time.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Front Cable Raise',
  'shoulders - strength',
  '1. Select the weight on a low pulley machine and grasp the single hand cable attachment that is attached to the low pulley with your left hand.
2. Face away from the pulley and put your arm straight down with the hand cable attachment in front of your thighs at arms'' length with the palms of the hand facing your thighs. This will be your starting position.
3. While maintaining the torso stationary (no swinging), lift the left arm to the front with a slight bend on the elbow and the palms of the hand always faces down. Continue to go up until you arm is slightly above parallel to the floor. Exhale as you execute this portion of the movement and pause for a second at the top.
4. Now as you inhale lower the arm back down slowly to the starting position.
5. Once all of the recommended amount of repetitions have been performed for this arm, switch arms and perform the exercise with the right one.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Front Cone Hops (or hurdle hops)',
  'quadriceps - plyometrics',
  '1. Set up a row of cones or other small barriers, placing them a few feet apart.
2. Stand in front of the first cone with your feet shoulder width apart. This will be your starting position.
3. Begin by jumping with both feet over the first cone, swinging both arms as you jump.
4. Absorb the impact of landing by bending the knees, rebounding out of the first leap by jumping over the next cone.
5. Continue until you have jumped over all of the cones.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Front Dumbbell Raise',
  'shoulders - strength',
  '1. Pick a couple of dumbbells and stand with a straight torso and the dumbbells on front of your thighs at arms length with the palms of the hand facing your thighs. This will be your starting position.
2. While maintaining the torso stationary (no swinging), lift the left dumbbell to the front with a slight bend on the elbow and the palms of the hands always facing down. Continue to go up until you arm is slightly above parallel to the floor. Exhale as you execute this portion of the movement and pause for a second at the top. Inhale after the second pause.
3. Now lower the dumbbell back down slowly to the starting position as you simultaneously lift the right dumbbell.
4. Continue alternating in this fashion until all of the recommended amount of repetitions have been performed for each arm.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Front Incline Dumbbell Raise',
  'shoulders - strength',
  '1. Sit down on an incline bench with the incline set anywhere between 30 to 60 degrees while holding a dumbbell on each hand. Tip: You can change the angle to hit the muscle a little differently each time.
2. Extend your arms straight in front of you and have your palms facing down with the dumbbells raised about 1 inch above your thighs. This will be your starting position.
3. Slowly raise the dumbbells straight up until they are slightly above your shoulders, while keeping your elbows locked. Squeeze at the top for a second and make sure you breathe out during this portion of the movement. Tip: Keep your head resting down against the bench and your legs on the floor at all times.
4. Lower the arms back to the starting position as you inhale.
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
  'Front Leg Raises',
  'hamstrings - stretching',
  '1. Stand next to a chair or other support, holding on with one hand.
2. Swing your leg forward, keeping the leg straight. Continue with a downward swing, bringing the leg as far back as your flexibility allows. Repeat 5-10 times, and then switch legs.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Front Plate Raise',
  'shoulders - strength',
  '1. While standing straight, hold a barbell plate in both hands at the 3 and 9 o''clock positions. Your palms should be facing each other and your arms should be extended and locked with a slight bend at the elbows and the plate should be down near your waist in front of you as far as you can go. Tip: The arms will remain in this position throughout the exercise. This will be your starting position.
2. Slowly raise the plate as you exhale until it is a little above shoulder level. Hold the contraction for a second. Tip: make sure that you do not swing the weight or bend at the elbows. Your torso should remain stationary throughout the movement as well.
3. As you inhale, slowly lower the plate back down to the starting position.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Front Raise And Pullover',
  'chest - strength',
  '1. Lie on a flat bench while holding a barbell using a palms down grip that is about 15 inches apart.
2. Place the bar on your upper thighs, extend your arms and lock them while keeping a slight bend on the elbows. This will be your starting position.
3. Now raise the weight using a semicircular motion and keeping your arms straight as you inhale. Continue the same movement until the bar is on the other side above your head . (Tip: the bar will travel approximately 180-degrees). At this point your arms should be parallel to the floor with the palms of your hands facing the ceiling.
4. Now return the barbell to the starting position by reversing the motion as you exhale.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Front Squat (Clean Grip)',
  'quadriceps - strength',
  '1. To begin, first set the bar in a rack slightly below shoulder level. Rest the bar on top of the deltoids, pushing into the clavicles, and lightly touching the throat. Your hands should be in a clean grip, touching the bar only with your fingers to help keep it in position.
2. Lift the bar off the rack by first pushing with your legs and at the same time straightening your torso. Step away from the rack and position your legs using a shoulder width medium stance with the toes slightly pointed out. Keep your head and elbows up at all times. This will be your starting position.
3. Bend at the knees, sitting down between your legs. Continue down until your hamstrings are on your calves. Keep your knees aligned with your feet by consciously using your abductors to push your knees out as you squat.
4. Begin to raise the bar as you exhale by pushing the floor mainly with the heel or middle of your foot as you straighten the legs again and return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Front Squats With Two Kettlebells',
  'quadriceps - strength',
  '1. Clean two kettlebells to your shoulders. Clean the kettlebells to your shoulders by extending through the legs and hips as you pull the kettlebells towards your shoulders. Rotate your wrists as you do so.
2. Looking straight ahead at all times, squat as low as you can and pause at the bottom. As you squat down, push your knees out. You should squat between your legs, keeping an upright torso, with your head and chest up.
3. Rise back up by driving through your heels and repeat.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Front Two-Dumbbell Raise',
  'shoulders - strength',
  '1. Pick a couple of dumbbells and stand with a straight torso and the dumbbells on front of your thighs at arms length with the palms of the hand facing your thighs. This will be your starting position.
2. While maintaining the torso stationary (no swinging), lift the dumbbells to the front with a slight bend on the elbow and the palms of the hands always facing down. Continue to go up until you arms are slightly above parallel to the floor. Exhale as you execute this portion of the movement and pause for a second at the top.
3. As you inhale, lower the dumbbells back down slowly to the starting position.
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
  'Full Range-Of-Motion Lat Pulldown',
  'lats - strength',
  '1. Either standing or seated on a high bench, grasp two stirrup cables that are attached to the high pulleys. Grab with the opposing hand so your arms are crisscrossed about you and your palms are facing forward.
2. Keeping your chest up and maintaining a slight arch in your lower back, pull the handles down as if you were doing a regular pulldown. The range of motion will be more of an arc. During the movement, rotate your hands so that in the bottom position your palms face each other rather than forward. Return slowly to the starting position and repeat.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Gironda Sternum Chins',
  'lats - strength',
  '1. Grasp the pull-up bar with a shoulder width underhand grip.
2. Now hang with your arms fully extended and stick your chest out and lean back. Tip: You will be leaning back throughout the entire movement. This will be your starting position.
3. Start pulling yourself towards the bar with your spine arched throughout the movement and your head leaning back as far away from the bar as possible. Exhale as you perform this portion of the movement. Tip: At the upper end of the movement, your hips and legs will be at about a 45-degree angle to the floor.
4. Keep pulling until your collarbone passes the bar and your lower chest or sternum area touches it. Hold that contraction for a second. Tip: By the time you''ve completed this portion of the movement; your head will be parallel to the floor.
5. Slowly start going back to the starting position as you inhale.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Glute Ham Raise',
  'hamstrings - powerlifting',
  '1. Begin by adjusting the equipment to fit your body. Place your feet against the footplate in between the rollers as you lie facedown. Your knees should be just behind the pad.
2. Start from the bottom of the movement. Keep your back arched as you begin the movement by flexing the knees. Drive your toes into the foot plate as you do so. Keep your upper body straight, and continue until your body is upright.
3. Return to the starting position, keeping your descent under control.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Glute Kickback',
  'glutes - strength',
  '1. Kneel on the floor or an exercise mat and bend at the waist with your arms extended in front of you (perpendicular to the torso) in order to get into a kneeling push-up position but with the arms spaced at shoulder width. Your head should be looking forward and the bend of the knees should create a 90-degree angle between the hamstrings and the calves. This will be your starting position.
2. As you exhale, lift up your right leg until the hamstrings are in line with the back while maintaining the 90-degree angle bend. Contract the glutes throughout this movement and hold the contraction at the top for a second. Tip: At the end of the movement the upper leg should be parallel to the floor while the calf should be perpendicular to it.
3. Go back to the initial position as you inhale and now repeat with the left leg.
4. Continue to alternate legs until all of the recommended repetitions have been performed.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Agachamento Goblet',
  'quadriceps - strength',
  '1. Stand holding a light kettlebell by the horns close to your chest. This will be your starting position.
2. Squat down between your legs until your hamstrings are on your calves. Keep your chest and head up and your back straight.
3. At the bottom position, pause and use your elbows to push your knees out. Return to the starting position, and repeat for 10-20 repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Good Morning',
  'hamstrings - powerlifting',
  '1. Begin with a bar on a rack at shoulder height. Rack the bar across the rear of your shoulders as you would a power squat, not on top of your shoulders. Keep your back tight, shoulder blades pinched together, and your knees slightly bent. Step back from the rack.
2. Begin by bending at the hips, moving them back as you bend over to near parallel. Keep your back arched and your cervical spine in proper alignment.
3. Reverse the motion by extending through the hips with your glutes and hamstrings. Continue until you have returned to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Good Morning off Pins',
  'hamstrings - powerlifting',
  '1. Begin with a bar on a rack at about the same height as your stomach. Bend over underneath the bar and rack the bar across the rear of your shoulders as you would a power squat, not on top of your shoulders. At the proper height, you should be near parallel to the floor when bent over. Keep your back tight, shoulder blades pinched together, and your knees slightly bent. Keep your back arched and your cervical spine in proper alignment.
2. Begin the motion by extending through the hips with your glutes and hamstrings, and you are standing with the weight. Slowly lower the weight back to the pins returning to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Gorilla Chin/Crunch',
  'abdominals - strength',
  '1. Hang from a chin-up bar using an underhand grip (palms facing you) that is slightly wider than shoulder width.
2. Now bend your knees at a 90 degree angle so that the calves are parallel to the floor while the thighs remain perpendicular to it. This will be your starting position.
3. As you exhale, pull yourself up while crunching your knees up at the same time until your knees are at chest level. You will stop going up as soon as your nose is at the same level as the bar. Tip: When you get to this point you should also be finishing the crunch at the same time.
4. Slowly start to inhale as you return to the starting position.
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
  'Groin and Back Stretch',
  'adductors - stretching',
  '1. Sit on the floor with your knees bent and feet together.
2. Interlock your fingers behind your head. This will be your starting position.
3. Curl downwards, bringing your elbows to the inside of your thighs. After a brief pause, return to the starting position with your head up and your back straight. Repeat for 10-20 repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Groiners',
  'adductors - stretching',
  '1. Begin in a pushup position on the floor. This will be your starting position.
2. Using both legs, jump forward landing with your feet next to your hands. Keep your head up as you do so.
3. Return to the starting position and immediately repeat the movement, continuing for 10-20 repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Hack Squat',
  'quadriceps - strength',
  '1. Place the back of your torso against the back pad of the machine and hook your shoulders under the shoulder pads provided.
2. Position your legs in the platform using a shoulder width medium stance with the toes slightly pointed out. Tip: Keep your head up at all times and also maintain the back on the pad at all times.
3. Place your arms on the side handles of the machine and disengage the safety bars (which on most designs is done by moving the side handles from a facing front position to a diagonal position).
4. Now straighten your legs without locking the knees. This will be your starting position. (Note: For the purposes of this discussion we will use the medium stance described above which targets overall development; however you can choose any of the three stances described in the foot positioning section).
5. Begin to slowly lower the unit by bending the knees as you maintain a straight posture with the head up (back on the pad at all times). Continue down until the angle between the upper leg and the calves becomes slightly less than 90-degrees (which is the point in which the upper legs are below parallel to the floor). Inhale as you perform this portion of the movement. Tip: If you performed the exercise correctly, the front of the knees should make an imaginary straight line with the toes that is perpendicular to the front. If your knees are past that imaginary line (if they are past your toes) then you are placing undue stress on the knee and the exercise has been performed incorrectly.
6. Begin to raise the unit as you exhale by pushing the floor with mainly with the heel of your foot as you straighten the legs again and go back to the starting position.
7. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Hammer Curls',
  'biceps - strength',
  '1. Stand up with your torso upright and a dumbbell on each hand being held at arms length. The elbows should be close to the torso.
2. The palms of the hands should be facing your torso. This will be your starting position.
3. Now, while holding your upper arm stationary, exhale and curl the weight forward while contracting the biceps. Continue to raise the weight until the biceps are fully contracted and the dumbbell is at shoulder level. Hold the contracted position for a brief moment as you squeeze the biceps. Tip: Focus on keeping the elbow stationary and only moving your forearm.
4. After the brief pause, inhale and slowly begin the lower the dumbbells back down to the starting position.
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
  'Hammer Grip Incline DB Bench Press',
  'chest - strength',
  '1. Lie back on an incline bench with a dumbbell on each hand on top of your thighs. The palms of your hand will be facing each other.
2. By using your thighs to help you get the dumbbells up, clean the dumbbells one arm at a time so that you can hold them at shoulder width.
3. Once at shoulder width, keep the palms of your hands with a neutral grip (palms facing each other). Keep your elbows flared out with the upper arms in line with the shoulders (perpendicular to the torso) and the elbows bent creating a 90-degree angle between the upper arm and the forearm. This will be your starting position.
4. Now bring down the weights slowly to your side as you breathe in. Keep full control of the dumbbells at all times.
5. As you breathe out, push the dumbbells up using your pectoral muscles. Lock your arms in the contracted position, hold for a second and then start coming down slowly. Tip: It should take at least twice as long to go down than to come up.
6. Repeat the movement for the prescribed amount of repetitions.
7. When you are done, place the dumbbells back in your thighs and then on the floor. This is the safest manner to dispose of the dumbbells.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Hamstring-SMR',
  'hamstrings - stretching',
  '1. In a seated position, extend your legs over a foam roll so that it is position on the back of the upper legs. Place your hands to the side or behind you to help support your weight. This will be your starting position.
2. Using your hands, lift your hips off of the floor and shift your weight on the foam roll to one leg. Relax the hamstrings of the leg you are stretching.
3. Roll over the foam from below the hip to above the back of the knee, pausing at points of tension for 10-30 seconds. Repeat for the other leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Rolo de Espuma' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Hamstring Stretch',
  'hamstrings - stretching',
  '1. Lie on your back with one leg extended above you, with the hip at ninety degrees. Keep the other leg flat on the floor.
2. Loop a belt, band, or rope over the ball of your foot. This will be your starting position.
3. Pull on the belt to create tension in the calves and hamstrings. Hold this stretch for 10-30 seconds, and repeat with the other leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Handstand Push-Ups',
  'shoulders - strength',
  '1. With your back to the wall bend at the waist and place both hands on the floor at shoulder width.
2. Kick yourself up against the wall with your arms straight. Your body should be upside down with the arms and legs fully extended. Keep your whole body as straight as possible. Tip: If doing this for the first time, have a spotter help you. Also, make sure that you keep facing the wall with your head, rather than looking down.
3. Slowly lower yourself to the ground as you inhale until your head almost touches the floor. Tip: It is of utmost importance that you come down slow in order to avoid head injury.
4. Push yourself back up slowly as you exhale until your elbows are nearly locked.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Hang Clean',
  'quadriceps - olympic weightlifting',
  '1. Begin with a shoulder width, double overhand or hook grip, with the bar hanging at the mid thigh position. Your back should be straight and inclined slightly forward.
2. Begin by aggressively extending through the hips, knees and ankles, driving the weight upward. As you do so, shrug your shoulders towards your ears.
3. Immediately recover by driving through the heels, keeping the torso upright and elbows up. Continue until you have risen to a standing position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Hang Clean - Below the Knees',
  'quadriceps - olympic weightlifting',
  '1. Begin with a shoulder width, double overhand or hook grip, with the bar hanging just below the knees. Your back should be straight and inclined slightly forward.
2. Begin by aggressively extending through the hips, knees and ankles, driving the weight upward. As you do so, shrug your shoulders towards your ears. As full extension is achieved, transition into the third pull by aggressively shrugging and flexing the arms with the elbows up and out.
3. At peak extension, aggressively pull yourself down, rotating your elbows under the bar as you do so. Receive the bar in a front squat position, the depth of which is dependent upon the height of the bar at the end of the third pull. The bar should be racked onto the protracted shoulders, lightly touching the throat with the hands relaxed. Continue to descend to the bottom squat position, which will help in the recovery.
4. Immediately recover by driving through the heels, keeping the torso upright and elbows up. Continue until you have risen to a standing position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Hang Snatch',
  'hamstrings - olympic weightlifting',
  '1. Begin with a wide grip on the bar, with an overhand or hook grip. The feet should be directly below the hips with the feet turned out. Your knees should be slightly bent, and the torso inclined forward. The spine should be fully extended and the head facing forward. The bar should be at the hips. This will be your starting position.
2. Aggressively extend through the legs and hips. At peak extension, shrug the shoulders and allow the elbows to flex to the side.
3. As you move your feet into the receiving position, forcefully pull yourself below the bar as you elevate the bar overhead. Receive the bar with your body as low as possible and the arms fully extended overhead.
4. Return to a standing position with the weight overhead. Follow by returning the weight to the ground under control.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Hang Snatch - Below Knees',
  'hamstrings - olympic weightlifting',
  '1. Begin with a wide grip on the bar, with an overhand or hook grip. The feet should be directly below the hips with the feet turned out. Your knees should be slightly bent, and the torso inclined forward. The spine should be fully extended and the head facing forward. The bar should be just below the knees. This will be your starting position.
2. Aggressively extend through the legs and hips. At peak extension, shrug the shoulders and allow the elbows to flex to the side.
3. As you move your feet into the receiving position, forcefully pull yourself below the bar as you elevate the bar overhead. Receive the bar with your body as low as possible and the arms fully extended overhead.
4. Return to a standing position with the weight overhead, and then return the weight to the floor under control.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Hanging Bar Good Morning',
  'hamstrings - powerlifting',
  '1. Begin with a bar on a rack at about the same height as your stomach. Suspend the bar using chains or suspension straps.
2. Bend over underneath the bar and rack the bar across the rear of your shoulders as you would a power squat, not on top of your traps. At the proper height, you should be near parallel to the floor when bent over. Keep your back tight, shoulder blades pinched together, and your knees slightly bent. Keep your back arched and your cervical spine in proper alignment.
3. Begin the motion by extending through the hips with your glutes and hamstrings, and you are standing with the weight.
4. Slowly lower the weight back to the starting position, where it is supported by the chains.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Elevação de Pernas na Barra',
  'abdominals - strength',
  '1. Hang from a chin-up bar with both arms extended at arms length in top of you using either a wide grip or a medium grip. The legs should be straight down with the pelvis rolled slightly backwards. This will be your starting position.
2. Raise your legs until the torso makes a 90-degree angle with the legs. Exhale as you perform this movement and hold the contraction for a second or so.
3. Go back slowly to the starting position as you breathe in.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Hanging Pike',
  'abdominals - strength',
  '1. Hang from a chin-up bar with your legs and feet together using an overhand grip (palms facing away from you) that is slightly wider than shoulder width. Tip: You may use wrist wraps in order to facilitate holding on to the bar.
2. Now bend your knees at a 90 degree angle and bring the upper legs forward so that the calves are perpendicular to the floor while the thighs remain parallel to it. This will be your starting position.
3. Pull your legs up as you exhale until you almost touch your shins with the bar above you. Tip: Try to straighten your legs as much as possible while at the top.
4. Lower your legs as slowly as possible until you reach the starting position. Tip: Avoid swinging and using momentum at all times.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Heaving Snatch Balance',
  'quadriceps - olympic weightlifting',
  '1. This drill helps you learn the snatch. Begin by holding a light weight across the back of the shoulders. Your feet should be slightly wider than hip width apart with the feet turned out, the same position that you would perform a squat with.
2. Begin by dipping with the knees slightly, and popping back up to briefly unload the bar. Drive yourself underneath the bar, elevating it overhead as you descend into a full squat.
3. Return to a standing position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Heavy Bag Thrust',
  'chest - plyometrics',
  '1. Utilize a heavy bag for this exercise. Assume an upright stance next to the bag, with your feet staggered, fairly wide apart. Place your hand on the bag at about chest height. This will be your starting position.
2. Begin by twisting at the waist, pushing the bag forward as hard as possible. Perform this move quickly, pushing the bag away from your body.
3. Receive the bag as it swings back by reversing these steps.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'High Cable Curls',
  'biceps - strength',
  '1. Stand between a couple of high pulleys and grab a handle in each arm. Position your upper arms in a way that they are parallel to the floor with the palms of your hands facing you. This will be your starting position.
2. Curl the handles towards you until they are next to your ears. Make sure that as you do so you flex your biceps and exhale. The upper arms should remain stationary and only the forearms should move. Hold for a second in the contracted position as you squeeze the biceps.
3. Slowly bring back the arms to the starting position.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Hip Circles (prone)',
  'abductors - stretching',
  '1. Position yourself on your hands and knees on the ground. Maintaining good posture, raise one bent knee off of the ground. This will be your starting position.
2. Keeping the knee in a bent position, rotate the femur in an arc, attempting to make a big circle with your knee.
3. Perform this slowly for a number of repetitions, and repeat on the other side.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Hip Extension with Bands',
  'glutes - strength',
  '1. Secure one end of the band to the lower portion of a post and attach the other to one ankle.
2. Facing the attachment point of the band, hold on to the column to stabilize yourself.
3. Keeping your head and your chest up, move the resisted leg back as far as you can while keeping the knee straight.
4. Return the leg to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Elástico/Banda' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Hip Flexion with Band',
  'quadriceps - strength',
  '1. Secure one end of the band to the lower portion of a post and attach the other to one ankle.
2. Face away from the attachment point of the band.
3. Keeping your head and your chest up, raise your knee up to 90 degrees and pause.
4. Return the leg to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Elástico/Banda' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Hip Lift with Band',
  'glutes - powerlifting',
  '1. After choosing a suitable band, lay down in the middle of the rack, after securing the band on either side of you. If your rack doesn''t have pegs, the band can be secured using heavy dumbbells or similar objects, just ensure they won''t move.
2. Adjust your position so that the band is directly over your hips. Bend your knees and place your feet flat on the floor. Your hands can be on the floor or holding the band in position.
3. Keeping your shoulders on the ground, drive through your heels to raise your hips, pushing into the band as high as you can.
4. Pause at the top of the motion, and return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Elástico/Banda' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Hug A Ball',
  'lower back - stretching',
  '1. Seat yourself on the floor.
2. Straddle an exercise ball between both legs and lower your hips down toward the floor.
3. Hug your arms around the ball to support your body. Adjust your legs so that your feet are flat on the floor and your knees line up over your ankles. Keep a good grip on the ball so it doesn''t roll away from you and send you back onto your buttocks.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Bola Suíça' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Hug Knees To Chest',
  'lower back - stretching',
  '1. Lie down on your back and pull both knees up to your chest.
2. Hold your arms under the knees, not over (that would put to much pressure on your knee joints).
3. Slowly pull the knees toward your shoulders. This also stretches your buttocks muscles.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Hurdle Hops',
  'hamstrings - plyometrics',
  '1. Set up a row of hurdles or other small barriers, placing them a few feet apart.
2. Stand in front of the first hurdle with your feet shoulder width apart. This will be your starting position.
3. Begin by jumping with both feet over the first hurdle, swinging both arms as you jump.
4. Absorb the impact of landing by bending the knees, rebounding out of the first leap by jumping over the next hurdle. Continue until you have jumped over all of the hurdles.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Hyperextensions (Back Extensions)',
  'lower back - strength',
  '1. Lie face down on a hyperextension bench, tucking your ankles securely under the footpads.
2. Adjust the upper pad if possible so your upper thighs lie flat across the wide pad, leaving enough room for you to bend at the waist without any restriction.
3. With your body straight, cross your arms in front of you (my preference) or behind your head. This will be your starting position. Tip: You can also hold a weight plate for extra resistance in front of you under your crossed arms.
4. Start bending forward slowly at the waist as far as you can while keeping your back flat. Inhale as you perform this movement. Keep moving forward until you feel a nice stretch on the hamstrings and you can no longer keep going without a rounding of the back. Tip: Never round the back as you perform this exercise. Also, some people can go farther than others. The key thing is that you go as far as your body allows you to without rounding the back.
5. Slowly raise your torso back to the initial position as you inhale. Tip: Avoid the temptation to arch your back past a straight line. Also, do not swing the torso at any time in order to protect the back from injury.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Hyperextensions With No Hyperextension Bench',
  'lower back - strength',
  '1. With someone holding down your legs, slide yourself down to the edge a flat bench until your hips hang off the end of the bench. Tip: Your entire upper body should be hanging down towards the floor. Also, you will be in the same position as if you were on a hyperextension bench but the range of motion will be shorter due to the height of the flat bench vs. that of the hyperextension bench.
2. With your body straight, cross your arms in front of you (my preference) or behind your head. This will be your starting position. Tip: You can also hold a weight plate for extra resistance in front of you under your crossed arms.
3. Start bending forward slowly at the waist as far as you can while keeping your back flat. Inhale as you perform this movement. Keep moving forward until you almost touch the floor or you feel a nice stretch on the hamstrings (whichever comes first). Tip: Never round the back as you perform this exercise.
4. Slowly raise your torso back to the initial position as you exhale. Tip: Avoid the temptation to arch your back past a straight line. Also, do not swing the torso at any time in order to protect the back from injury.
5. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'IT Band and Glute Stretch',
  'abductors - stretching',
  '1. Loop a belt, rope, or band around one of your feet, and swing that leg across your body to the opposite side, keeping the leg extended as you lay on the ground. This will be your starting position.
2. Keeping your foot off of the floor, pull on the belt, using the tension to pull the toes up. Hold for 10-20 seconds, and repeat on the other side.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Iliotibial Tract-SMR',
  'abductors - stretching',
  '1. Lay on your side, with the bottom leg placed onto a foam roller between the hip and the knee. The other leg can be crossed in front of you.
2. Place as much of your weight as is tolerable onto your bottom leg; there is no need to keep your bottom leg in contact with the ground. Be sure to relax the muscles of the leg you are stretching.
3. Roll your leg over the foam from you hip to your knee, pausing for 10-30 seconds at points of tension. Repeat with the opposite leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Rolo de Espuma' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Inchworm',
  'hamstrings - stretching',
  '1. Stand with your feet close together. Keeping your legs straight, stretch down and put your hands on the floor directly in front of you. This will be your starting position.
2. Begin by walking your hands forward slowly, alternating your left and your right. As you do so, bend only at the hip, keeping your legs straight.
3. Keep going until your body is parallel to the ground in a pushup position.
4. Now, keep your hands in place and slowly take short steps with your feet, moving only a few inches at a time.
5. Continue walking until your feet are by hour hands, keeping your legs straight as you do so.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Incline Barbell Triceps Extension',
  'triceps - strength',
  '1. Hold a barbell with an overhand grip (palms down) that is a little closer together than shoulder width.
2. Lie back on an incline bench set at any angle between 45-75-degrees.
3. Bring the bar overhead with your arms extended and elbows in. The arms should be in line with the torso above the head. This will be your starting position.
4. Now lower the bar in a semicircular motion behind your head until your forearms touch your biceps. Inhale as you perform this movement. Tip: Keep your upper arms stationary and close to your head at all times. Only the forearms should move.
5. Return to the starting position as you breathe out and you contract the triceps. Hold the contraction for a second.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Incline Bench Pull',
  'middle back - strength',
  '1. Grab a dumbbell in each hand and lie face down on an incline bench that is set to an incline that is approximately 30 degrees.
2. Let the arms hang to your sides fully extended as they point to the floor.
3. Turn the wrists until your hands have a pronated (palms down) grip.
4. Now flare the elbows out. This will be your starting position.
5. As you breathe out, start to pull the dumbbells up as if you are doing a reverse bench press. You will do this by bending at the elbows and bringing the upper arms up as you let the forearms hang. Continue this motion until the upper arms are at the same level as your back. Tip: The elbows will come out to the side and your upper arms and torso should make the letter "T" at the top of the movement. Hold the contraction at the top for a second.
6. Slowly go back down to the starting position as you breathe in.
7. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Incline Cable Chest Press',
  'chest - strength',
  '1. Adjust the weight to an appropriate amount and be seated, grasping the handles. Your upper arms should be about 45 degrees to the body, with your head and chest up. The elbows should be bent to about 90 degrees. This will be your starting position.
2. Begin by extending through the elbow, pressing the handles together straight in front of you. Keep your shoulder blades retracted as you execute the movement.
3. After pausing at full extension, return to the starting position, keeping tension on the cables.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Incline Cable Flye',
  'chest - strength',
  '1. To get yourself into the starting position, set the pulleys at the floor level (lowest level possible on the machine that is below your torso).
2. Place an incline bench (set at 45 degrees) in between the pulleys, select a weight on each one and grab a pulley on each hand.
3. With a handle on each hand, lie on the incline bench and bring your hands together at arms length in front of your face. This will be your starting position.
4. With a slight bend of your elbows (in order to prevent stress at the biceps tendon), lower your arms out at both sides in a wide arc until you feel a stretch on your chest. Breathe in as you perform this portion of the movement. Tip: Keep in mind that throughout the movement, the arms should remain stationary. The movement should only occur at the shoulder joint.
5. Return your arms back to the starting position as you squeeze your chest muscles and exhale. Hold the contracted position for a second. Tip: Make sure to use the same arc of motion used to lower the weights.
6. Repeat the movement for the prescribed amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Incline Dumbbell Bench With Palms Facing In',
  'chest - strength',
  '1. Lie back on an incline bench with a dumbbell on each hand on top of your thighs. The palms of your hand will be facing each other.
2. By using your thighs to help you get the dumbbells up, clean the dumbbells one arm at a time so that you can hold them at shoulder width.
3. Once at shoulder width, keep the palms of your hands with a neutral grip (palms facing each other). Keep your elbows flared out with the upper arms in line with the shoulders (perpendicular to the torso) and the elbows bent creating a 90-degree angle between the upper arm and the forearm. This will be your starting position.
4. Now bring down the weights slowly to your side as you breathe in. Keep full control of the dumbbells at all times.
5. As you breathe out, push the dumbbells up using your pectoral muscles. Lock your arms in the contracted position, hold for a second and then start coming down slowly. Tip: It should take at least twice as long to go down than to come up.
6. Repeat the movement for the prescribed amount of repetitions.
7. When you are done, place the dumbbells back in your thighs and then on the floor. This is the safest manner to dispose of the dumbbells.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Rosca Inclinada com Halter',
  'biceps - strength',
  '1. Sit back on an incline bench with a dumbbell in each hand held at arms length. Keep your elbows close to your torso and rotate the palms of your hands until they are facing forward. This will be your starting position.
2. While holding the upper arm stationary, curl the weights forward while contracting the biceps as you breathe out. Only the forearms should move. Continue the movement until your biceps are fully contracted and the dumbbells are at shoulder level. Hold the contracted position for a second.
3. Slowly begin to bring the dumbbells back to starting position as your breathe in.
4. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Incline Dumbbell Flyes',
  'chest - strength',
  '1. Hold a dumbbell on each hand and lie on an incline bench that is set to an incline angle of no more than 30 degrees.
2. Extend your arms above you with a slight bend at the elbows.
3. Now rotate the wrists so that the palms of your hands are facing you. Tip: The pinky fingers should be next to each other. This will be your starting position.
4. As you breathe in, start to slowly lower the arms to the side while keeping the arms extended and while rotating the wrists until the palms of the hand are facing each other. Tip: At the end of the movement the arms will be by your side with the palms facing the ceiling.
5. As you exhale start to bring the dumbbells back up to the starting position by reversing the motion and rotating the hands so that the pinky fingers are next to each other again. Tip: Keep in mind that the movement will only happen at the shoulder joint and at the wrist. There is no motion that happens at the elbow joint.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Incline Dumbbell Flyes - With A Twist',
  'chest - strength',
  '1. Hold a dumbbell in each hand and lie on an incline bench that is set to an incline angle of no more than 30 degrees.
2. Extend your arms above you with a slight bend at the elbows.
3. Now rotate the wrists so that the palms of your hands are facing you. Tip: The pinky fingers should be next to each other. This will be your starting position.
4. As you breathe in, start to slowly lower the arms to the side while keeping the arms extended and while rotating the wrists until the palms of the hand are facing each other. Tip: At the end of the movement the arms will be by your side with the palms facing the ceiling.
5. As you exhale start to bring the dumbbells back up to the starting position by reversing the motion and rotating the hands so that the pinky fingers are next to each other again. Tip: Keep in mind that the movement will only happen at the shoulder joint and at the wrist. There is no motion that happens at the elbow joint.
6. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Incline Dumbbell Press',
  'chest - strength',
  '1. Lie back on an incline bench with a dumbbell in each hand atop your thighs. The palms of your hands will be facing each other.
2. Then, using your thighs to help push the dumbbells up, lift the dumbbells one at a time so that you can hold them at shoulder width.
3. Once you have the dumbbells raised to shoulder width, rotate your wrists forward so that the palms of your hands are facing away from you. This will be your starting position.
4. Be sure to keep full control of the dumbbells at all times. Then breathe out and push the dumbbells up with your chest.
5. Lock your arms at the top, hold for a second, and then start slowly lowering the weight. Tip Ideally, lowering the weights should take about twice as long as raising them.
6. Repeat the movement for the prescribed amount of repetitions.
7. When you are done, place the dumbbells back on your thighs and then on the floor. This is the safest manner to release the dumbbells.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Incline Hammer Curls',
  'biceps - strength',
  '1. Seat yourself on an incline bench with a dumbbell in each hand. You should pressed firmly against he back with your feet together. Allow the dumbbells to hang straight down at your side, holding them with a neutral grip. This will be your starting position.
2. Initiate the movement by flexing at the elbow, attempting to keep the upper arm stationary.
3. Continue to the top of the movement and pause, then slowly return to the start position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Bíceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Incline Inner Biceps Curl',
  'biceps - strength',
  '1. Hold a dumbbell in each hand and lie back on an incline bench.
2. The dumbbells should be at arm''s length hanging at your sides and your palms should be facing out. This will be your starting position.
3. Now as you exhale curl the weight outward and up while keeping your forearms in line with your side deltoids. Continue the curl until the dumbbells are at shoulder height and to the sides of your deltoids. Tip: The end of the movement should look similar to a double biceps pose.
4. After a second contraction at the top of the movement, start to inhale and slowly lower the weights back to the starting position using the same path used to bring them up.
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
  'Incline Push-Up',
  'chest - strength',
  '1. Stand facing bench or sturdy elevated platform. Place hands on edge of bench or platform, slightly wider than shoulder width.
2. Position forefoot back from bench or platform with arms and body straight. Arms should be perpendicular to body. Keeping body straight, lower chest to edge of box or platform by bending arms.
3. Push body up until arms are extended. Repeat.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Incline Push-Up Close-Grip',
  'triceps - strength',
  '1. Stand facing a Smith machine bar or sturdy elevated platform at an appropriate height.
2. Place your hands next to one another on the bar.
3. Position your feet back from the bar with arms and body straight. This will be your starting position.
4. Keeping your body straight, lower your chest to the bar by bending the arms.
5. Return to the starting position by extending the elbows, pressing yourself back up.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Incline Push-Up Depth Jump',
  'chest - plyometrics',
  '1. For this drill you will need a box about 12 inches high, and two thick mats or aerobics steps.
2. Place the steps just outside of your shoulders, and place your feet on top of the box so that you are in an incline pushup position, your hands just inside the steps. This will be your starting position.
3. Begin by bending at the elbows to lower your body, quickly reversing position to push your body off of the ground. As you leave the ground, move your hands onto the steps, bending your elbows to absorb the impact.
4. Repeat the motion to return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Incline Push-Up Medium',
  'chest - strength',
  '1. Stand facing a Smith machine bar or sturdy elevated platform at an appropriate height.
2. Place your hands on the bar, with your hands about shoulder width apart.
3. Position your feet back from the bar with arms and body straight. This will be your starting position.
4. Keeping your body straight, lower your chest to the bar by bending the arms.
5. Return to the starting position by extending the elbows, pressing yourself back up.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Incline Push-Up Reverse Grip',
  'chest - strength',
  '1. Stand facing a Smith machine bar or sturdy elevated platform at an appropriate height.
2. Place your hands on the bar palms up, with your hands about shoulder width apart.
3. Position your feet back from the bar with arms and body straight. This will be your starting position.
4. Keeping your body straight, lower your chest to the bar by bending the arms.
5. Return to the starting position by extending the elbows, pressing yourself back up.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Incline Push-Up Wide',
  'chest - strength',
  '1. Stand facing a Smith machine bar or sturdy elevated platform at an appropriate height.
2. Place your hands on the bar, with your hands wider than shoulder width.
3. Position your feet back from the bar with arms and body straight. Your arms should be perpendicular to the body. This will be your starting position.
4. Keeping your body straight, lower your chest to the bar by bending the arms.
5. Return to the starting position by extending the elbows, pressing yourself back up.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Intermediate Groin Stretch',
  'hamstrings - stretching',
  '1. Lie on your back with your legs extended. Loop a belt, rope, or band around one of your feet, and swing that leg as far to the side as you can. This will be your starting position.
2. Pull gently on the belt to create tension in your groin and hamstring muscles. Hold for 10-20 seconds, and repeat on the other side.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Intermediate Hip Flexor and Quad Stretch',
  'quadriceps - stretching',
  '1. Lie face down on the floor, with a rope, belt, or band looped around one foot.
2. Flex the knee and extend the hip of the leg to be stretched, using both hands to pull on the belt. Your knee and your hip should come off of the floor, creating tension in the hip flexors and quadriceps. Hold the stretch for 10-20 seconds, and repeat on the other leg.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Internal Rotation with Band',
  'shoulders - strength',
  '1. Choke the band around a post. The band should be at the same height as your elbow. Stand with your right side to the band a couple of feet away.
2. Grasp the end of the band with your right hand, and keep your elbow pressed firmly to your side. We recommend you hold a pad or foam roll in place with your elbow to keep it firmly in position.
3. With your upper arm in position, your elbow should be flexed to 90 degrees with your hand reaching away from your torso. This will be your starting position.
4. Execute the movement by rotating your arm in a forehand motion, keeping your elbow in place.
5. Continue as far as you are able, pause, and then return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Elástico/Banda' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Inverted Row',
  'middle back - strength',
  '1. Position a bar in a rack to about waist height. You can also use a smith machine.
2. Take a wider than shoulder width grip on the bar and position yourself hanging underneath the bar. Your body should be straight with your heels on the ground with your arms fully extended. This will be your starting position.
3. Begin by flexing the elbow, pulling your chest towards the bar. Retract your shoulder blades as you perform the movement.
4. Pause at the top of the motion, and return yourself to the start position.
5. Repeat for the desired number of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Inverted Row with Straps',
  'middle back - strength',
  '1. Hang a rope or suspension straps from a rack or other stable object. Grasp the ends and position yourself in a supine position hanging from the ropes. Your body should be straight with your heels on the ground with your arms fully extended. This will be your starting position.
2. Begin by flexing the elbow, pulling your chest to your hands. Retract your shoulder blades as you perform the movement.
3. Pause at the top of the motion, and return yourself to the start position.
4. Repeat for the desired number of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Iron Cross',
  'shoulders - strength',
  '',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Halteres' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Iron Crosses (stretch)',
  'quadriceps - stretching',
  '1. Lie face down on the floor, with your arms extended out to your side, palms pressed to the floor. This will be your starting position.
2. To begin, flex one knee and bring that leg across the back of your body, attempting to touch it to the ground near the opposite hand.
3. Promptly return the leg to the starting postion, and quickly repeat with the other leg. Continue alternating for 10-20 repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Isometric Chest Squeezes',
  'chest - plyometrics',
  '1. While either seating or standing, bend your arms at a 90-degree angle and place the palms of your hands together in front of your chest. Tip: Your hands should be open with the palms together and fingers facing forward (perpendicular to your torso).
2. Push both hands against each other as you contract your chest. Start with slow tension and increase slowly. Keep breathing normally as you execute this contraction.
3. Hold for the recommended number of seconds.
4. Now release the tension slowly.
5. Rest for the recommended amount of time and repeat.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Isometric Neck Exercise - Front And Back',
  'neck - strength',
  '1. With your head and neck in a neutral position (normal position with head erect facing forward), place both of your hands on the front side of your head.
2. Now gently push forward as you contract the neck muscles but resisting any movement of your head. Start with slow tension and increase slowly. Keep breathing normally as you execute this contraction.
3. Hold for the recommended number of seconds.
4. Now release the tension slowly.
5. Rest for the recommended amount of time and repeat with your hands placed on the back side of your head.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Trapézio' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Isometric Neck Exercise - Sides',
  'neck - strength',
  '1. With your head and neck in a neutral position (normal position with head erect facing forward), place your left hand on the left side of your head.
2. Now gently push towards the left as you contract the left neck muscles but resisting any movement of your head. Start with slow tension and increase slowly. Keep breathing normally as you execute this contraction.
3. Hold for the recommended number of seconds.
4. Now release the tension slowly.
5. Rest for the recommended amount of time and repeat with your right hand placed on the right side of your head.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Trapézio' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Isometric Wipers',
  'chest - strength',
  '1. Assume a push-up position, supporting your weight on your hands and toes while keeping your body straight. Your hands should be just outside of shoulder width. This will be your starting position.
2. Begin by shifting your body weight as far to one side as possible, allowing the elbow on that side to flex as you lower your body.
3. Reverse the motion by extending the flexed arm, pushing yourself up and then dropping to the other side.
4. Repeat for the desired number of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'JM Press',
  'triceps - strength',
  '1. Start the exercise the same way you would a close grip bench press. You will lie on a flat bench while holding a barbell at arms length (fully extended) with the elbows in. However, instead of having the arms perpendicular to the torso, make sure the bar is set in a direct line above the upper chest. This will be your starting position.
2. Now beginning from a fully extended position lower the bar down as if performing a lying triceps extension. Inhale as you perform this movement. When you reach the half way point, let the bar roll back about one inch by moving the upper arms towards your legs until they are perpendicular to the torso. Tip: Keep the bend at the elbows constant as you bring the upper arms forward.
3. As you exhale, press the bar back up by using the triceps to perform a close grip bench press.
4. Now go back to the starting position and start over.
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
  'Jackknife Sit-Up',
  'abdominals - strength',
  '1. Lie flat on the floor (or exercise mat) on your back with your arms extended straight back behind your head and your legs extended also. This will be your starting position.
2. As you exhale, bend at the waist while simultaneously raising your legs and arms to meet in a jackknife position. Tip: The legs should be extended and lifted at approximately a 35-45 degree angle from the floor and the arms should be extended and parallel to your legs. The upper torso should be off the floor.
3. While inhaling, lower your arms and legs back to the starting position.
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
  'Janda Sit-Up',
  'abdominals - strength',
  '1. Position your body on the floor in the basic sit-up position; knees to a ninety degree angle with feet flat on the floor and arms either crossed over your chest or to the sides. This will be your starting position.
2. As you strongly tighten your glutes and hamstrings, fill your lungs with air and in a slow (three to six second count) ascent, slowly exhale. Tip: It is important to tighten the glutes and hamstrings as this will cause the hip flexors to be inactivated in a process called reciprocal inhibition, which basically means that opposite muscles to the contracted ones will relax.
3. As you inhale, slowly go back in a controlled manner to the starting position.
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
  'Jefferson Squats',
  'quadriceps - strength',
  '1. Place a barbell on the floor.
2. Stand in the middle of the bar length wise.
3. Bend down by bending at the knees and keeping your back straight and grasp the front of the bar with your right hand. Your palm should be in (neutral grip) facing the left side.
4. Grasp the rear of the bar with your left hand. The palm of your hand should be in neutral grip alignment (palms facing the right side). Tip: Ensure that your grip is even on the bar. Your torso should be positioned right in the middle of the bar and the distance between your torso and your right hand (which should be at the front) should be the same as the distance between your torso and your left hand (which should be to your back).
5. Now stand straight up with the weight. Tip: Your feet should be shoulder width apart and your toes slightly pointed out.
6. Squat down by bending at the knees and keeping your back straight until your upper thighs are parallel with the floor. Tip: Keep your back as vertical as possible with the floor and your head up. Also remember to not let your knees go past your toes. Inhale during this portion of the movement.
7. Now drive yourself back up to the starting position by pushing with the feet . Tip: Keep the bar hanging at arm''s length and your elbows locked with a slight bend. The arms only serve as hooks. Avoid doing any lifting with them. Do the lifting with your thighs; not your arms.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Jerk Balance',
  'shoulders - olympic weightlifting',
  '1. This drill helps you learn to drive yourself low enough during the jerk and corrects those who move backward during the movement. Begin with the bar racked in the jerk position, with the shoulders forward, torso upright, and the feet split slightly apart.
2. Initiate the movement as you would a normal jerk, dipping at the knees while keeping your torso vertical, and driving back up forcefully, using momentum and not your arms to elevate the weight.
3. Keep the rear foot in place, using it to drive your body forward into a full split as you jerk the weight. Recover by standing up with the weight overhead.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Jerk Dip Squat',
  'quadriceps - olympic weightlifting',
  '1. This movement strengthens the dip portion of the jerk. Begin with the bar racked in the jerk position, with the shoulders forward to create a shelf and the bar lightly contacting the throat. The feet should be directly under the hips, with the feet turned out as is comfortable.
2. Keeping the torso vertical, dip by flexing the knees, allowing them to travel forward and without moving the hips to the rear. The dip should not be excessive. Return the weight to the starting position by driving forcefully though the feet.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Jogging, Treadmill',
  'quadriceps - cardio',
  '1. To begin, step onto the treadmill and select the desired option from the menu. Most treadmills have a manual setting, or you can select a program to run. Typically, you can enter your age and weight to estimate the amount of calories burned during exercise. Elevation can be adjusted to change the intensity of the workout.
2. Treadmills offer convenience, cardiovascular benefits, and usually have less impact than jogging outside. A 150 lb person will burn almost 250 calories jogging for 30 minutes, compared to more than 450 calories running. Maintain proper posture as you jog, and only hold onto the handles when necessary, such as when dismounting or checking your heart rate.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Máquina' LIMIT 1),
  'beginner',
  'cardio',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Keg Load',
  'lower back - strongman',
  '1. To load kegs, place the desired number a distance from the loading platform, typically 30-50 feet.
2. Begin by grabbing the close handle of the first keg, tilting it onto its side to grab the opposite edge of the bottom of the keg. Lift the keg up to your chest.
3. The higher you can place the keg, the faster you should be able to move to the platform. Shouldering is usually not allowed. Be sure to keep a firm hold on the keg. Move as quickly as possible to the platform, and load it, extending through your hips, knees, and ankles to get it as high as possible.
4. Return to the starting position to retrieve the next keg, and repeat until the event is completed.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Peito' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Kettlebell Arnold Press',
  'shoulders - strength',
  '1. Clean a kettlebell to your shoulder. Clean the kettlebell to your shoulder by extending through the legs and hips as you raise the kettlebell towards your shoulder. The palm should be facing inward.
2. Looking straight ahead, press the kettlebell out and overhead, rotating your wrist so that your palm faces forward at the top of the motion.
3. Return the kettlebell to the starting position, with the palm facing in.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Kettlebell Dead Clean',
  'hamstrings - strength',
  '1. Place kettlebell between your feet. To get in the starting position, push your butt back and look straight ahead.
2. Clean the kettlebell to your shoulder. Clean the kettlebell to your shoulders by extending through the legs and hips as you raise the kettlebell towards your shoulder. The wrist should rotate as you do so.
3. Lower the kettlebell, keeping the hamstrings loaded by keeping your back straight and your butt out.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Kettlebell Figure 8',
  'abdominals - strength',
  '1. Place one kettlebell between your legs and take a wider than shoulder width stance. Bend over by pushing your butt out and keeping your back flat.
2. Pick up a kettlebell and pass it to your other hand between your legs. The receiving hand should reach from behind the legs. Go back and forth for several repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Kettlebell Hang Clean',
  'hamstrings - strength',
  '1. Place kettlebell between your feet. To get in the starting position, push your butt back and look straight ahead.
2. Clean kettlebell to your shoulder. Clean the kettlebell to your shoulders by extending through the legs and hips as you raise the kettlebell towards your shoulder. The wrist should rotate as you do so.
3. Lower kettlebell to a hanging position between your legs while keeping the hamstrings loaded. Keep your head up at all times.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Kettlebell One-Legged Deadlift',
  'hamstrings - strength',
  '1. Hold a kettlebell by the handle in one hand. Stand on one leg, on the same side that you hold the kettlebell.
2. Keeping that knee slightly bent, perform a stiff legged deadlift by bending at the hip, extending your free leg behind you for balance.
3. Continue lowering the kettlebell until you are parallel to the ground, and then return to the upright position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Kettlebell Pass Between The Legs',
  'abdominals - strength',
  '1. Place one kettlebell between your legs and take a comfortable stance. Bend over by pushing your butt out and keeping your back flat.
2. Pick up a kettlebell and pass it to your other hand between your legs, in the fashion of a "W". Go back and forth for several repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Kettlebell Pirate Ships',
  'shoulders - strength',
  '1. With a wide stance, hold a kettlebell with both hands. Allow it to hang at waist level with your arms extended. This will be your starting position.
2. Initiate the movement by turning to one side, swinging the kettlebell to head height. Briefly pause at the top of the motion.
3. Allow the bell to drop as you rotate to the opposite side, again raising the kettlebell to head height.
4. Repeat for the desired amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Kettlebell Pistol Squat',
  'quadriceps - strength',
  '1. Pick up a kettlebell with two hands and hold it by the horns. Hold one leg off of the floor and squat down on the other.
2. Squat down by flexing the knee and sitting back with the hips, holding the kettlebell up in front of you.
3. Hold the bottom position for a second and then reverse the motion, driving through the heel and keeping your head and chest up.
4. Lower yourself again and repeat.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Kettlebell Seated Press',
  'shoulders - strength',
  '1. Sit on the floor and spread your legs out comfortably.
2. Clean one kettlebell to your shoulder.
3. Press the kettlebell up and out until it is locked out overhead. Return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Kettlebell Seesaw Press',
  'shoulders - strength',
  '1. Clean two kettlebells two your shoulders.
2. Press one kettlebell.
3. Lower the kettlebell and immediately press the other kettlebell. Make sure to do the same amount of reps on both sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Kettlebell Sumo High Pull',
  'traps - strength',
  '1. Place a kettlebell on the ground between your feet. Position your feet in a wide stance, and grasp the kettlebell with two hands. Set your hips back as far as possible, with your knees bent. Keep your chest and head up. This will be your starting position.
2. Begin by extending the hips and knees, simultaneously pulling the kettlebell to your shoulders, raising your elbows as you do so. Reverse the motion to return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Trapézio' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Kettlebell Thruster',
  'shoulders - strength',
  '1. Clean two kettlebells to your shoulders. Clean the kettlebells to your shoulders by extending through the legs and hips as you pull the kettlebells towards your shoulders. Rotate your wrists as you do so. This will be your starting position.
2. Begin to squat by flexing your hips and knees, lowering your hips between your legs. Maintain an upright, straight back as you descend as low as you can.
3. At the bottom, reverse direction and squat by extending your knees and hips, driving through your heels. As you do so, press both kettlebells overhead by extending your arms straight up, using the momentum from the squat to help drive the weights upward.
4. As you begin the next repetition, return the weights to the shoulders.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Kettlebell Turkish Get-Up (Lunge style)',
  'shoulders - strength',
  '1. Lie on your back on the floor and press a kettlebell to the top position by extending the elbow. Bend the knee on the same side as the kettlebell.
2. Keeping the kettlebell locked out at all times, pivot to the opposite side and use your non- working arm to assist you in driving forward to the lunge position. Using your free hand, push yourself to a seated position, then progressing to one knee.
3. While looking up at the kettlebell, slowly stand up. Reverse the motion back to the starting position and repeat.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Kettlebell Turkish Get-Up (Squat style)',
  'shoulders - strength',
  '1. Lie on your back on the floor and press a kettlebell to the top position by extending the elbow. Bend the knee on the same side as the kettlebell.
2. Keeping the kettlebell locked out at all times, pivot to the opposite side and use your non- working arm to assist you in driving forward to the lunge position.
3. Using your free hand, push yourself to a seated position, then progressing to your feet. While looking up at the kettlebell, slowly stand up. Reverse the motion back to the starting position and repeat.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Kettlebell Windmill',
  'abdominals - strength',
  '1. Place a kettlebell in front of your lead foot and clean and press it overhead with your opposite arm. Clean the kettlebell to your shoulder by extending through the legs and hips as you pull the kettlebell towards your shoulders. Rotate your wrist as you do so, so that the palm faces forward. Press it overhead by extending the elbow.
2. Keeping the kettlebell locked out at all times, push your butt out in the direction of the locked out kettlebell. Turn your feet out at a forty-five degree angle from the arm with the locked out kettlebell. Bending at the hip to one side, sticking your butt out, slowly lean until you can touch the floor with your free hand. Keep your eyes on the kettlebell that you hold over your head at all times.
3. Pause for a second after reaching the ground and reverse the motion back to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Kettlebell' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Kipping Muscle Up',
  'lats - strength',
  '1. Grip the rings using a false grip, with the base of your palms on top of the rings.
2. Begin with a movement swinging your legs backward slightly.
3. Counter that movement by swinging your legs forward and up, jerking your chin and chest back, pulling yourself up with both arms as you do so. As you reach the top position of the pull-up, pull the rings to your armpits as you roll your shoulders forward, allowing your elbows to move straight back behind you. This puts you into the proper position to continue into the dip portion of the movement.
4. Maintaining control and stability, extend through the elbow to complete the motion.
5. Use care when lowering yourself to the ground.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Knee Across The Body',
  'glutes - stretching',
  '1. Lie down on the floor with your right leg straight. Bend your left leg and lower it across your body, holding the knee down toward the floor with your right hand. (The knee doesn''t need to touch the floor if you''re tight.)
2. Place your left arm comfortably beside you and turn your head to the left. Imagine you have a weight tied to your tailbone. let your tailbone fall back toward the floor as your chest reaches in the opposite direction to stretch your lower back. Switch sides.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Knee Circles',
  'calves - stretching',
  '1. Stand with your legs together and hands by your waist.
2. Now move your knees in a circular motion as you breathe normally.
3. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Panturrilha' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Knee/Hip Raise On Parallel Bars',
  'abdominals - strength',
  '1. Position your body on the vertical leg raise bench so that your forearms are resting on the pads next to the torso and holding on to the handles. Your arms will be bent at a 90 degree angle.
2. The torso should be straight with the lower back pressed against the pad of the machine and the legs extended pointing towards the floor. This will be your starting position.
3. Now as you breathe out, lift your legs up as you keep them extended. Continue this movement until your legs are roughly parallel to the floor and then hold the contraction for a second. Tip: Do not use any momentum or swinging as you perform this exercise.
4. Slowly go back to the starting position as you breathe in.
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
  'Knee Tuck Jump',
  'hamstrings - plyometrics',
  '1. Begin in a comfortable standing position with your knees slightly bent. Hold your hands in front of you, palms down with your fingertips together at chest height. This will be your starting position.
2. Rapidly dip down into a quarter squat and immediately explode upward. Drive the knees towards the chest, attempting to touch them to the palms of the hands.
3. Jump as high as you can, raising your knees up, and then ensure a good land be re-extending your legs, absorbing impact through be allowing the knees to rebend.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Posterior de Coxa' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Kneeling Arm Drill',
  'shoulders - plyometrics',
  '1. This drill helps increase arm efficiency during the run. Begin kneeling, left foot in front, right knee down. Apply pressure through the front heel to keep your glutes and hamstrings activated.
2. Begin by blocking the arms in long, pendulum like swings. Close the arm angle, blocking with the arms as you would when jogging, progressing to a run and finally a sprint.
3. As soon as your hands pass the hip, accelerate them forward during the sprinting motion to move them as quickly as possible.
4. Switch knees and repeat.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Ombros' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'calisthenics',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Kneeling Cable Crunch With Alternating Oblique Twists',
  'abdominals - strength',
  '1. Connect a rope attachment to a high pulley cable and position a mat on the floor in front of it.
2. Grab the rope with both hands and kneel approximately two feet back from the tower.
3. Position the rope behind your head with your hands by your ears.
4. Keep your hands in the same place, contract your abs and pull downward on the rope in a crunching movement until your elbows reach your knees.
5. Pause briefly at the bottom and rise up in a slow and controlled manner until you reach the starting position.
6. Repeat the same downward movement until you''re halfway down, at which time you''ll begin rotating one of your elbows to the opposite knee.
7. Again, pause briefly at the bottom and rise up in a slow and controlled manner until you reach the starting position.
8. Repeat the same movement as before, but alternate the other elbow to the opposite knee.
9. Continue this series of movements to failure.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Abdômen' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Kneeling Cable Triceps Extension',
  'triceps - strength',
  '1. Place a bench sideways in front of a high pulley machine.
2. Hold a straight bar attachment above your head with your hands about 6 inches apart with your palms facing down.
3. Face away from the machine and kneel.
4. Place your head and the back of your upper arms on the bench. Your elbows should be bent with the forearms pointing towards the high pulley. This will be your starting position.
5. While keeping your upper arms close to your head at all times with the elbows in, press the bar out in a semicircular motion until the elbows are locked and your arms are parallel to the floor. Contract the triceps hard and keep this position for a second. Exhale as you perform this movement.
6. Slowly return to the starting position as you breathe in.
7. Repeat for the recommended amount of repetitions.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Tríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Kneeling Forearm Stretch',
  'forearms - stretching',
  '1. Start by kneeling on a mat with your palms flat and your fingers pointing back toward your knees.
2. Slowly lean back keeping your palms flat on the floor until you feel a stretch in your wrists and forearms. Hold for 20-30 seconds.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Antebraço' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Kneeling High Pulley Row',
  'lats - strength',
  '1. Select the appropriate weight using a pulley that is above your head. Attach a rope to the cable and kneel a couple of feet away, holding the rope out in front of you with both arms extended. This will be your starting position.
2. Initiate the movement by flexing the elbows and fully retracting your shoulders, pulling the rope toward your upper chest with your elbows out.
3. After pausing briefly, slowly return to the starting position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Costas' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Cabo/Polia' LIMIT 1),
  'beginner',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Kneeling Hip Flexor',
  'quadriceps - stretching',
  '1. Kneel on a mat and bring your right knee up so the bottom of your foot is on the floor and extend your left leg out behind you so the top of your foot is on the floor.
2. Shift your weight forward until you feel a stretch in your hip. Hold for 15 seconds, then repeat for your other side.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Quadríceps' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Peso Corporal' LIMIT 1),
  'beginner',
  'flexibility',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Kneeling Jump Squat',
  'glutes - olympic weightlifting',
  '1. Begin kneeling on the floor with a barbell racked across the back of your shoulders, or you can use your body weight for this exercise. This can be done inside of a power rack to make unracking easier.
2. Sit back with your hips until your glutes touch your feet, keeping your head and chest up.
3. Explode up with your hips, generating enough power to land with your feet flat on the floor.
4. Continue with the squat by driving through your heels and extending the knees to come to a standing position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'advanced',
  'strength',
  TRUE,
  TRUE
);
INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  'Kneeling Single-Arm High Pulley Row',
  'lats - strength',
  '1. Attach a single handle to a high pulley and make your weight selection.
2. Kneel in front of the cable tower, taking the cable with one hand with your arm extended. This will be your starting position.
3. Starting with your palm facing forward, pull the weight down to your torso by flexing the elbow and retract the shoulder blade. As you do so, rotate the wrist so that at the completion of the movement, your palm is now facing you.
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
  'Kneeling Squat',
  'glutes - powerlifting',
  '1. Set the bar to the proper height in a power rack. Kneel behind the bar; it may be beneficial to put a mat down to pad your knees. Slide under the bar, racking it across the back of your shoulders. Your shoulder blades should be retracted and the bar tight across your back. Unrack the weight.
2. With your head looking forward, sit back with your butt until you touch your calves.
3. Reverse the motion, returning the torso to an upright position.',
  (SELECT id FROM public.muscle_groups WHERE name = 'Glúteos' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = 'Barra' LIMIT 1),
  'intermediate',
  'strength',
  TRUE,
  TRUE
);