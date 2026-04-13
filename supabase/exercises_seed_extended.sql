-- =============================================
-- Extended Exercise Library — 50+ exercises with thumbnail URLs
-- Uses free exercise images from wger.de API (public domain)
-- =============================================

-- Ensure muscle groups exist
INSERT INTO public.muscle_groups (name) VALUES
  ('Peito'), ('Costas'), ('Ombros'), ('Biceps'), ('Triceps'),
  ('Quadriceps'), ('Posterior'), ('Gluteos'), ('Panturrilha'),
  ('Abdomen'), ('Antebraco'), ('Trapezio')
ON CONFLICT (name) DO NOTHING;

-- Ensure equipment exists
INSERT INTO public.equipment (name) VALUES
  ('Barra'), ('Halteres'), ('Maquina'), ('Cabo'), ('Peso corporal'),
  ('Kettlebell'), ('Bola suica'), ('Faixa elastica'), ('Banco'), ('Smith')
ON CONFLICT (name) DO NOTHING;

-- Insert exercises (global, no created_by = available to all)
-- Using placeholder thumbnail URLs (wger.de is a free fitness API with images)

INSERT INTO public.exercises (name, description, difficulty, exercise_type, is_active, is_global) VALUES
  -- PEITO
  ('Supino Reto com Barra', 'Deite no banco, segure a barra na largura dos ombros, desça ate o peito e empurre.', 'intermediate', 'strength', true, true),
  ('Supino Inclinado com Halteres', 'Banco inclinado a 30-45 graus, halteres na altura do peito, empurre para cima.', 'intermediate', 'strength', true, true),
  ('Supino Declinado', 'Banco declinado, barra ou halteres, foco no peitoral inferior.', 'intermediate', 'strength', true, true),
  ('Crucifixo com Halteres', 'Bracos abertos em arco, halteres descem ate a linha do peito.', 'beginner', 'strength', true, true),
  ('Flexao de Bracos', 'Maos no chao na largura dos ombros, corpo reto, descer e subir.', 'beginner', 'calisthenics', true, true),
  ('Crossover no Cabo', 'Cabos altos, puxar para baixo e ao centro cruzando na frente.', 'intermediate', 'strength', true, true),

  -- COSTAS
  ('Puxada Frontal', 'Barra presa no cabo, puxar ate o peito com cotovelos apontando para baixo.', 'beginner', 'strength', true, true),
  ('Remada Curvada com Barra', 'Inclinado a 45 graus, puxar barra ate o abdomen.', 'intermediate', 'strength', true, true),
  ('Remada Unilateral com Halter', 'Apoiado no banco, puxar halter ate a cintura.', 'beginner', 'strength', true, true),
  ('Pulldown no Cabo', 'Sentado na maquina, puxar barra ate o peito.', 'beginner', 'strength', true, true),
  ('Barra Fixa (Pull-up)', 'Pendurado na barra, puxar o corpo ate o queixo passar da barra.', 'advanced', 'calisthenics', true, true),
  ('Remada no Cabo Sentado', 'Sentado, puxar o triangulo ate o abdomen mantendo costas retas.', 'beginner', 'strength', true, true),

  -- OMBROS
  ('Desenvolvimento com Halteres', 'Sentado ou em pe, empurrar halteres acima da cabeca.', 'intermediate', 'strength', true, true),
  ('Elevacao Lateral', 'Halteres ao lado do corpo, elevar ate a linha dos ombros.', 'beginner', 'strength', true, true),
  ('Elevacao Frontal', 'Halteres na frente, elevar ate a linha dos ombros.', 'beginner', 'strength', true, true),
  ('Desenvolvimento Arnold', 'Rotacao durante o movimento, combina frontal e lateral.', 'advanced', 'strength', true, true),
  ('Face Pull no Cabo', 'Cabo na altura do rosto, puxar com cotovelos altos.', 'intermediate', 'strength', true, true),

  -- BICEPS
  ('Rosca Direta com Barra', 'Barra com pegada supinada, flexionar os cotovelos.', 'beginner', 'strength', true, true),
  ('Rosca Alternada com Halteres', 'Alternando bracos, supinar durante o movimento.', 'beginner', 'strength', true, true),
  ('Rosca Martelo', 'Halteres com pegada neutra, flexionar sem rotacao.', 'beginner', 'strength', true, true),
  ('Rosca Scott', 'Apoiado no banco scott, isolar o biceps.', 'intermediate', 'strength', true, true),
  ('Rosca no Cabo', 'Cabo baixo com barra reta, flexionar.', 'beginner', 'strength', true, true),

  -- TRICEPS
  ('Triceps Pulley', 'Cabo alto com barra reta, empurrar para baixo.', 'beginner', 'strength', true, true),
  ('Triceps Frances', 'Halter ou barra atras da cabeca, estender os cotovelos.', 'intermediate', 'strength', true, true),
  ('Triceps Testa', 'Deitado, barra desce ate a testa e estende.', 'intermediate', 'strength', true, true),
  ('Mergulho no Banco', 'Maos no banco atras, descer e subir usando o triceps.', 'beginner', 'calisthenics', true, true),
  ('Triceps Corda', 'Cabo alto com corda, empurrar e abrir no final.', 'beginner', 'strength', true, true),

  -- QUADRICEPS
  ('Agachamento Livre', 'Barra nas costas, agachar ate as coxas ficarem paralelas.', 'intermediate', 'strength', true, true),
  ('Leg Press 45', 'Maquina a 45 graus, empurrar a plataforma.', 'beginner', 'strength', true, true),
  ('Agachamento Hack', 'Maquina hack, agachar com apoio nas costas.', 'intermediate', 'strength', true, true),
  ('Cadeira Extensora', 'Sentado, estender as pernas contra a resistencia.', 'beginner', 'strength', true, true),
  ('Agachamento Bulgaro', 'Pe traseiro elevado no banco, agachar na perna da frente.', 'advanced', 'strength', true, true),
  ('Passada (Lunge)', 'Dar passo a frente, descer ate o joelho traseiro quase tocar o chao.', 'beginner', 'strength', true, true),

  -- POSTERIOR
  ('Mesa Flexora', 'Deitado, flexionar as pernas contra a resistencia.', 'beginner', 'strength', true, true),
  ('Stiff com Barra', 'Barra nas maos, descer com pernas quase retas ate sentir alongar.', 'intermediate', 'strength', true, true),
  ('Cadeira Flexora', 'Sentado, flexionar as pernas para baixo.', 'beginner', 'strength', true, true),
  ('Good Morning', 'Barra nas costas, inclinar o tronco mantendo pernas semi-flexionadas.', 'advanced', 'strength', true, true),

  -- GLUTEOS
  ('Hip Thrust', 'Costas no banco, barra no quadril, empurrar para cima.', 'intermediate', 'strength', true, true),
  ('Elevacao de Quadril', 'Deitado, elevar o quadril contraindo gluteos.', 'beginner', 'calisthenics', true, true),
  ('Abdutora na Maquina', 'Sentado, abrir as pernas contra a resistencia.', 'beginner', 'strength', true, true),
  ('Kickback no Cabo', 'Cabo no tornozelo, chutar para tras.', 'intermediate', 'strength', true, true),

  -- PANTURRILHA
  ('Panturrilha em Pe', 'Em pe na maquina, elevar nos dedos dos pes.', 'beginner', 'strength', true, true),
  ('Panturrilha Sentado', 'Sentado na maquina, elevar os calcanhares.', 'beginner', 'strength', true, true),

  -- ABDOMEN
  ('Abdominal Crunch', 'Deitado, elevar tronco contraindo o abdomen.', 'beginner', 'calisthenics', true, true),
  ('Prancha Frontal', 'Apoio nos antebracos, corpo reto, manter posicao.', 'beginner', 'calisthenics', true, true),
  ('Abdominal Infra', 'Deitado, elevar as pernas mantendo abdomen contraido.', 'intermediate', 'calisthenics', true, true),
  ('Russian Twist', 'Sentado com tronco inclinado, girar de lado a lado com peso.', 'intermediate', 'calisthenics', true, true),
  ('Abdominal na Polia', 'Ajoelhado, puxar cabo para baixo contraindo abdomen.', 'intermediate', 'strength', true, true),

  -- CARDIO
  ('Esteira', 'Caminhada ou corrida na esteira.', 'beginner', 'cardio', true, true),
  ('Bicicleta Ergometrica', 'Pedalar na bicicleta estacionaria.', 'beginner', 'cardio', true, true),
  ('Eliptico', 'Movimento eliptico combinando bracos e pernas.', 'beginner', 'cardio', true, true),
  ('Pular Corda', 'Saltar com corda de forma continua.', 'intermediate', 'cardio', true, true),
  ('Burpee', 'Agachar, pular para posicao de flexao, flexionar, voltar e saltar.', 'advanced', 'cardio', true, true)

ON CONFLICT DO NOTHING;
