-- Substitui o banco de exercícios pelo catálogo curado do treino.io (194 únicos)
-- ⚠️  TRUNCATE exercises CASCADE remove também workout_exercises e workout_session_sets
-- (dados de teste pré-lançamento — aceitável)

-- 1. Garante grupos musculares em PT-BR
DO $$
DECLARE
  g TEXT;
  groups TEXT[] := ARRAY[
    'Abdômen','Bíceps','Costas','Deltóide Posterior',
    'Glúteos','Ombros','Panturrilha','Peito',
    'Posterior de Coxa','Quadríceps','Trapézio','Tríceps'
  ];
BEGIN
  FOREACH g IN ARRAY groups LOOP
    IF NOT EXISTS (SELECT 1 FROM muscle_groups WHERE name = g) THEN
      INSERT INTO muscle_groups (name) VALUES (g);
    END IF;
  END LOOP;
END $$;

-- 2. Remove todos os exercícios existentes e dados dependentes
TRUNCATE exercises CASCADE;

-- 3. Insere 194 exercícios organizados por grupo muscular
INSERT INTO exercises (name, primary_muscle_group_id, exercise_type)
SELECT e.name,
       (SELECT id FROM muscle_groups WHERE name = e.mg LIMIT 1),
       'strength'
FROM (VALUES
  -- ── Abdômen (4) ─────────────────────────────────────────────
  ('Abdomen infra paralela',                                  'Abdômen'),
  ('Abdomen infra solo',                                      'Abdômen'),
  ('Abdômen supra no cabo',                                   'Abdômen'),
  ('Frog',                                                    'Abdômen'),

  -- ── Bíceps (16) ──────────────────────────────────────────────
  ('Bíceps com o banco inclinado no cabo',                    'Bíceps'),
  ('Bíceps scott unilateral com halteres',                    'Bíceps'),
  ('Bíceps unilateral banco 90',                              'Bíceps'),
  ('Drag Curl Unilateral',                                    'Bíceps'),
  ('Rosca 45 com halteres',                                   'Bíceps'),
  ('Rosca alta no cabo',                                      'Bíceps'),
  ('Rosca Alternada com Halteres',                            'Bíceps'),
  ('Rosca Concentrada com Halteres',                          'Bíceps'),
  ('Rosca Direta com Barra',                                  'Bíceps'),
  ('Rosca inversa',                                           'Bíceps'),
  ('Rosca Martelo com Corda',                                 'Bíceps'),
  ('Rosca Martelo com Halteres',                              'Bíceps'),
  ('Rosca punho',                                             'Bíceps'),
  ('Rosca punho inversa',                                     'Bíceps'),
  ('Rosca Scott na Máquina',                                  'Bíceps'),
  ('Rosca Spider',                                            'Bíceps'),

  -- ── Costas (39) ──────────────────────────────────────────────
  ('Barra Fixa',                                              'Costas'),
  ('Chinese Row',                                             'Costas'),
  ('DY Row',                                                  'Costas'),
  ('Lat Pulldown Banco no Cabo',                              'Costas'),
  ('Lat Pulldown Maquina',                                    'Costas'),
  ('Pendlay Row',                                             'Costas'),
  ('Pull down',                                               'Costas'),
  ('Pullover Com Halter',                                     'Costas'),
  ('Pullover no Cabo',                                        'Costas'),
  ('Puxada alta triângulo ou supinada',                       'Costas'),
  ('Puxada alta unilateral',                                  'Costas'),
  ('Puxada alta unilateral de lado',                          'Costas'),
  ('Puxada Neutra',                                           'Costas'),
  ('Puxada Pronada',                                          'Costas'),
  ('Puxada Supinada',                                         'Costas'),
  ('Puxada unilateral',                                       'Costas'),
  ('Puxada unilateral com o joelho no chão',                  'Costas'),
  ('Remada aberta unilateral',                                'Costas'),
  ('Remada alta na Máquina',                                  'Costas'),
  ('Remada around unilateral',                                'Costas'),
  ('Remada Articulada',                                       'Costas'),
  ('Remada baixa na maquina (Iso Low Row)',                   'Costas'),
  ('Remada baixa Neutra',                                     'Costas'),
  ('Remada baixa Pronada',                                    'Costas'),
  ('Remada baixa supinada',                                   'Costas'),
  ('Remada baixa triangulo',                                  'Costas'),
  ('Remada baixa unilateral',                                 'Costas'),
  ('Remada Cavalinho',                                        'Costas'),
  ('Remada curvada',                                          'Costas'),
  ('Remada Curvada na máquina',                               'Costas'),
  ('Remada Curvada Pronada',                                  'Costas'),
  ('Remada Curvada Supinada',                                 'Costas'),
  ('Remada na maquina com cabo',                              'Costas'),
  ('Remada na maquina com suporte do peito',                  'Costas'),
  ('Remada Ponta de Barra',                                   'Costas'),
  ('Remada unilateral máquina',                               'Costas'),
  ('Remada unilateral no cabo',                               'Costas'),
  ('Seal Row',                                                'Costas'),
  ('Serrote',                                                 'Costas'),

  -- ── Deltóide Posterior (5) ───────────────────────────────────
  ('Crucifixo inverso unilateral no cabo',                    'Deltóide Posterior'),
  ('Crucifixo invertido',                                     'Deltóide Posterior'),
  ('Face pull',                                               'Deltóide Posterior'),
  ('Fly invertido',                                           'Deltóide Posterior'),
  ('Fly invertido unilateral',                                'Deltóide Posterior'),

  -- ── Glúteos (27) ─────────────────────────────────────────────
  ('Abdução com miniband',                                    'Glúteos'),
  ('Abdução no cabo - com banco inclinado',                   'Glúteos'),
  ('Abdução no cabo pela frente',                             'Glúteos'),
  ('Abdução no cabo por trás da perna da frente',             'Glúteos'),
  ('Abdutor',                                                 'Glúteos'),
  ('Abdutor inclinado',                                       'Glúteos'),
  ('Afundo bulgaro - ênfase em glúteo',                       'Glúteos'),
  ('Agachamento sumo',                                        'Glúteos'),
  ('Cadeira Abdutora 110 graus',                              'Glúteos'),
  ('Cadeira Abdutora 45 graus',                               'Glúteos'),
  ('Cadeira Abdutora 90 graus',                               'Glúteos'),
  ('Cadeira Adutora',                                         'Glúteos'),
  ('Coice no cabo',                                           'Glúteos'),
  ('Coice no cabo com joelho no banco',                       'Glúteos'),
  ('Deslocamento lateral com miniband',                       'Glúteos'),
  ('Elevação pélvica livre',                                  'Glúteos'),
  ('Elevação Pelvica na Máquina',                             'Glúteos'),
  ('Elevação Pelvica unilateral',                             'Glúteos'),
  ('Extensão com miniband',                                   'Glúteos'),
  ('Extensão de quadril com caneleira',                       'Glúteos'),
  ('Extensão de Quadril cruzada no cabo',                     'Glúteos'),
  ('Extensão de Quadril na Apolete',                          'Glúteos'),
  ('Extensão de Quadril no Cabo',                             'Glúteos'),
  ('Extensor unilateral',                                     'Glúteos'),
  ('Gluteo 4 apoios com caneleira',                           'Glúteos'),
  ('Glúteo Ostra',                                            'Glúteos'),
  ('Leg curtsy unilateral',                                   'Glúteos'),

  -- ── Ombros (16) ──────────────────────────────────────────────
  ('Desenvolvimento Arnold',                                  'Ombros'),
  ('Desenvolvimento com barra (cage press)',                  'Ombros'),
  ('Desenvolvimento com halteres',                            'Ombros'),
  ('Desenvolvimento na máquina',                              'Ombros'),
  ('Desenvolvimento no smith',                                'Ombros'),
  ('Elevação frontal com halteres',                           'Ombros'),
  ('Elevação frontal no cabo',                                'Ombros'),
  ('Elevação lateral banco 45',                               'Ombros'),
  ('Elevação lateral cabo - por trás',                        'Ombros'),
  ('Elevação lateral com halteres de pé',                     'Ombros'),
  ('Elevação Lateral em Y de pé',                             'Ombros'),
  ('Elevação Lateral em Y deitado',                           'Ombros'),
  ('Elevação lateral máquina unilateral',                     'Ombros'),
  ('Elevação lateral na máquina',                             'Ombros'),
  ('Elevação lateral polia baixa',                            'Ombros'),
  ('Elevação lateral sentado',                                'Ombros'),

  -- ── Panturrilha (4) ──────────────────────────────────────────
  ('Panturrilha de pé',                                       'Panturrilha'),
  ('Panturrilha leg',                                         'Panturrilha'),
  ('Panturrilha sentado',                                     'Panturrilha'),
  ('Panturrilha smith',                                       'Panturrilha'),

  -- ── Peito (23) ───────────────────────────────────────────────
  ('Cross Over Polia Alta',                                   'Peito'),
  ('Cross Over Polia Baixa',                                  'Peito'),
  ('Crucifixo Banco Inclinado',                               'Peito'),
  ('Crucifixo Banco Reto',                                    'Peito'),
  ('Crucifixo inclinado no cabo',                             'Peito'),
  ('Dips (Mergulho)',                                         'Peito'),
  ('Fly',                                                     'Peito'),
  ('Paralela',                                                'Peito'),
  ('Press around baixo',                                      'Peito'),
  ('Pull around no cabo',                                     'Peito'),
  ('Supino Declinado com Barra',                              'Peito'),
  ('Supino Declinado Máquina MTS',                            'Peito'),
  ('Supino Declinado na Maquina (anilha)',                    'Peito'),
  ('Supino Inclinado com Barra',                              'Peito'),
  ('Supino inclinado com halteres',                           'Peito'),
  ('Supino inclinado máquina MTS',                            'Peito'),
  ('Supino Inclinado na Máquina (anilha)',                    'Peito'),
  ('Supino Inclinado no Smith',                               'Peito'),
  ('Supino Reto com Barra',                                   'Peito'),
  ('Supino reto com halteres',                                'Peito'),
  ('Supino Reto Máquina MTS',                                 'Peito'),
  ('Supino Reto na Maquina (anilha)',                         'Peito'),
  ('Supino reto no smith',                                    'Peito'),

  -- ── Posterior de Coxa (14) ───────────────────────────────────
  ('Cadeira flexora',                                         'Posterior de Coxa'),
  ('Flexora de Pé',                                           'Posterior de Coxa'),
  ('Good Morning Livre',                                      'Posterior de Coxa'),
  ('Good Morning V Squat',                                    'Posterior de Coxa'),
  ('Hiperextensão de quadril no banco romano',                'Posterior de Coxa'),
  ('Hiperextensão de quadril no banco romano unilateral',     'Posterior de Coxa'),
  ('Levantamento terra sumo',                                 'Posterior de Coxa'),
  ('Levantamento Terra Tradicional',                          'Posterior de Coxa'),
  ('Mesa flexora',                                            'Posterior de Coxa'),
  ('Rack Pull',                                               'Posterior de Coxa'),
  ('RDL Unilateral',                                          'Posterior de Coxa'),
  ('Stiff com barra',                                         'Posterior de Coxa'),
  ('Stiff com Halter',                                        'Posterior de Coxa'),
  ('Stiff Unilateral',                                        'Posterior de Coxa'),

  -- ── Quadríceps (30) ──────────────────────────────────────────
  ('Afundo búlgaro - ênfase em quadríceps',                   'Quadríceps'),
  ('Afundo com Halteres',                                     'Quadríceps'),
  ('Afundo com Halteres com step no pé da frente',            'Quadríceps'),
  ('Afundo com step duplo',                                   'Quadríceps'),
  ('Afundo no Smith',                                         'Quadríceps'),
  ('Afundo no Smith com Step no Pé da Frente',                'Quadríceps'),
  ('Afundo no V Squat',                                       'Quadríceps'),
  ('Afundo pra trás no smith',                                'Quadríceps'),
  ('Agachamento bulgaro com halter unilateral',               'Quadríceps'),
  ('Agachamento bulgaro com step na frente',                  'Quadríceps'),
  ('Agachamento Bulgaro no Smith',                            'Quadríceps'),
  ('Agachamento Bulgaro no Smith com step no pé da frente',   'Quadríceps'),
  ('Agachamento invertido no V Squat',                        'Quadríceps'),
  ('Agachamento Livre',                                       'Quadríceps'),
  ('Agachamento no Smith',                                    'Quadríceps'),
  ('Agachamento Taça',                                        'Quadríceps'),
  ('Agachamento v-squat',                                     'Quadríceps'),
  ('Belt Squat',                                              'Quadríceps'),
  ('Cadeira Extensora',                                       'Quadríceps'),
  ('Front Squat',                                             'Quadríceps'),
  ('Hack Squat',                                              'Quadríceps'),
  ('Leg Press 180 Graus',                                     'Quadríceps'),
  ('Leg Press 45 Graus',                                      'Quadríceps'),
  ('Leg Press 45 graus Unilateral',                           'Quadríceps'),
  ('Leg Press Horizontal',                                    'Quadríceps'),
  ('Leg press Horizontal unilateral',                         'Quadríceps'),
  ('Pendulo Squat',                                           'Quadríceps'),
  ('Sissy Squat',                                             'Quadríceps'),
  ('Step up',                                                 'Quadríceps'),
  ('Step Up com Halter',                                      'Quadríceps'),

  -- ── Trapézio (2) ─────────────────────────────────────────────
  ('Encolhimento no cabo',                                    'Trapézio'),
  ('Encolhimento no cabo unilateral',                         'Trapézio'),

  -- ── Tríceps (14) ─────────────────────────────────────────────
  ('Extensão de tríceps no cabo unilateral',                  'Tríceps'),
  ('Extensão Tríceps com Barra',                              'Tríceps'),
  ('JM press',                                                'Tríceps'),
  ('Mergulho (Simular Apolette)',                             'Tríceps'),
  ('Tríceps Coice',                                           'Tríceps'),
  ('Tríceps corda',                                           'Tríceps'),
  ('Tríceps Frances com Halteres Bilateral',                  'Tríceps'),
  ('Tríceps Frances no Cabo',                                 'Tríceps'),
  ('Tríceps Frances Unilateral no Cabo',                      'Tríceps'),
  ('Tríceps Testa com Barra no Cabo',                         'Tríceps'),
  ('Tríceps Testa com Halter Bilateral',                      'Tríceps'),
  ('Tríceps Testa com Halter Unilateral',                     'Tríceps'),
  ('Tríceps testa no chão',                                   'Tríceps'),
  ('Tríceps testa unilateral no cabo',                        'Tríceps')

) AS e(name, mg);
