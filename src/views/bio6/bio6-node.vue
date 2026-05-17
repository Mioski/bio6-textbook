<template>
  <div class="node-page">
    <!-- Header navigation -->
    <div class="node-nav">
      <button class="back-btn" @click="goBack">← {{ backLabel }}</button>
      <div class="node-num">Тема {{ node?.order }}</div>
    </div>

    <div v-if="node" class="node-content">
      <!-- Node title -->
      <h1 class="node-title">{{ node.title }}</h1>
      <div v-if="node.difficulty === 'deep'" class="deep-badge">⭐ Углублённое изучение</div>

      <!-- Recap (if came from chain) -->
      <Bio6BridgeRecap v-if="recap" type="recap" :text="recap.text" />

      <!-- 1. Hook -->
      <Bio6Hook v-if="hook" :text="hook" />

      <!-- 1b. Illustration -->
      <Bio6Illustration
        v-if="illustration"
        :src="illustration.src"
        :alt="node.title"
        :caption="illustration.caption"
      />

      <!-- 2. Cheatsheet (collapsed by default) -->
      <Bio6Cheatsheet v-if="cheatsheet" :sections="cheatsheet" @opened="markElement('cheatsheet')" />

      <!-- 3. Progress bar -->
      <Bio6ProgressBar :progress="progress" />

      <!-- 4. Main interactive -->
      <section class="section-wrap" v-if="hasMainInteractive">
        <h2 class="section-title">🎯 Главный интерактив</h2>
        <component
          :is="mainInteractiveComponent"
          :nodeId="nodeId"
          :simData="simData"
          @completed="onInteractiveCompleted"
        />
      </section>

      <!-- 5. Remember + Self-check -->
      <Bio6RememberCheck
        v-if="rememberCheck"
        :remember="rememberCheck.remember"
        :check="rememberCheck.check"
      />

      <!-- 6. Trainers -->
      <section class="section-wrap" v-if="sortTasks.length || matchTasks.length || readingTasks.length || trueFalseTasks.length">
        <h2 class="section-title">🔁 Тренажёры</h2>
        <Bio6ReadingTask
          v-for="task in readingTasks"
          :key="task.id"
          :task="task"
          :nodeId="nodeId"
          @completed="(r) => onTrainerCompleted('reading_' + task.id, r)"
        />
        <Bio6TrueFalseTrainer
          v-if="trueFalseTasks.length"
          :tasks="trueFalseTasks"
          @completed="onTrainerCompleted('trueFalse', {})"
        />
        <Bio6SortTrainer
          v-for="task in sortTasks"
          :key="task.id"
          :task="task"
          :nodeId="nodeId"
          @completed="(r) => onTrainerCompleted('sort_' + task.id, r)"
        />
        <Bio6MatchTrainer
          v-for="task in matchTasks"
          :key="task.id"
          :task="task"
          :nodeId="nodeId"
          @completed="(r) => onTrainerCompleted('match_' + task.id, r)"
        />
      </section>

      <!-- 7. Misconceptions -->
      <Bio6Misconceptions v-if="misconceptions.length" :items="misconceptions" />

      <!-- 8. Glossary -->
      <Bio6Glossary v-if="glossary.length" :terms="glossary" />

      <!-- 9. Final quiz -->
      <Bio6FinalQuiz
        v-if="quiz.length"
        :questions="quiz"
        @completed="onQuizCompleted"
      />

      <!-- 10. Did you know -->
      <Bio6DidYouKnow v-if="dyk.length" :facts="dyk" />

      <!-- 10. Bridge (if chain continues) -->
      <Bio6BridgeRecap v-if="bridge" type="bridge" :text="bridge.text" />

      <!-- 11. Navigation buttons -->
      <div class="node-footer">
        <button v-if="prevNode" class="nav-btn prev-btn" @click="nav.goToNode(prevNode.id)">
          ← {{ shortTitle(prevNode.title) }}
        </button>
        <button v-if="nextNode" class="nav-btn next-btn" @click="onNextTopic">
          Следующая тема →
          <div class="nav-btn-sub">{{ shortTitle(nextNode.title) }}</div>
        </button>
      </div>
    </div>

    <div v-else class="not-found">
      <p>Тема не найдена.</p>
      <button @click="nav.goToIndex()">← На главную</button>
    </div>
  </div>
</template>

<script setup>
import { inject, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Bio6Hook from './components/Bio6Hook.vue'
import Bio6Cheatsheet from './components/Bio6Cheatsheet.vue'
import Bio6ProgressBar from './components/Bio6ProgressBar.vue'
import Bio6Misconceptions from './components/Bio6Misconceptions.vue'
import Bio6Glossary from './components/Bio6Glossary.vue'
import Bio6FinalQuiz from './components/Bio6FinalQuiz.vue'
import Bio6DidYouKnow from './components/Bio6DidYouKnow.vue'
import Bio6BridgeRecap from './components/Bio6BridgeRecap.vue'
import Bio6SortTrainer from './components/Bio6SortTrainer.vue'
import Bio6MatchTrainer from './components/Bio6MatchTrainer.vue'
import Bio6ReadingTask from './components/Bio6ReadingTask.vue'
import Bio6Illustration from './components/Bio6Illustration.vue'
import Bio6RememberCheck from './components/Bio6RememberCheck.vue'
import Bio6TrueFalseTrainer from './components/Bio6TrueFalseTrainer.vue'
import Bio6CellSim from './components/sims/Bio6CellSim.vue'
import Bio6PhotosynthesisSim from './components/sims/Bio6PhotosynthesisSim.vue'
import Bio6SeedSim from './components/sims/Bio6SeedSim.vue'
import Bio6LifeCycleSim from './components/sims/Bio6LifeCycleSim.vue'
import Bio6GenericSim from './components/sims/Bio6GenericSim.vue'
import ProgressService from '../../services/bio6/ProgressService.js'

const props = defineProps({ nodeId: String })

const cs = inject('ContentService')
const nav = inject('NavigationService')
const chain = inject('ChainService')
const router = useRouter()

const deepSimMap = {
  'topic_12046_plant_cell': Bio6CellSim,
  'topic_12056_photosynthesis': Bio6PhotosynthesisSim,
  'topic_12073_seed_structure': Bio6SeedSim,
  'topic_12075_plant_development': Bio6LifeCycleSim,
}

const node = computed(() => cs.getNode(props.nodeId))
const nextNode = computed(() => cs.getNextNode(props.nodeId))
const prevNode = computed(() => cs.getPrevNode(props.nodeId))

const cheatsheet = computed(() => cs.getCheatsheet(props.nodeId))
const glossary = computed(() => cs.getGlossary(props.nodeId))
const misconceptions = computed(() => cs.getMisconceptions(props.nodeId))
const quiz = computed(() => cs.getFinalQuiz(props.nodeId))
const sortTasks = computed(() => cs.getSortTasks(props.nodeId))
const matchTasks = computed(() => cs.getMatchTasks(props.nodeId))
const dyk = computed(() => cs.getDidYouKnow(props.nodeId))
const simData = computed(() => cs.getSimData(props.nodeId))
const illustration = computed(() => cs.getIllustration(props.nodeId))
const readingTasks = computed(() => cs.getReadingTasks(props.nodeId))
const rememberCheck = computed(() => cs.getRememberCheck(props.nodeId))
const trueFalseTasks = computed(() => cs.getTrueFalseTasks(props.nodeId))

const bridge = computed(() => chain.getBridge(props.nodeId))
const recap = computed(() => chain.getRecap(props.nodeId))

const mainInteractiveComponent = computed(() => {
  if (deepSimMap[props.nodeId]) return deepSimMap[props.nodeId]
  if (simData.value) return Bio6GenericSim
  return null
})

const hasMainInteractive = computed(() => !!mainInteractiveComponent.value)

const hooks = {
  'topic_12043_botany': 'Томат — это ягода. Земляника — нет. Арбуз — тоже ягода. Морковь — видоизменённый корень. Ботаника — наука, которая объясняет, почему привычные названия часто неточны.',
  'topic_12044_plant_features': 'У тебя под ногами — крупнейшие живые организмы планеты. Гигантская осиновая роща Пандо в США — это одно растение с 40 000 стволами и весом 6 000 тонн.',
  'topic_12045_higher_lower_plants': 'Папоротник и мох растут без единого цветка и семени. Они размножаются спорами — так же, как первые растения делали это 450 миллионов лет назад.',
  'topic_12046_plant_cell': 'Посмотри на листок. В 1 мм² листа — до 400 000 клеток. Каждая работает как отдельная фабрика: вырабатывает энергию, строит вещества, выводит отходы — всё одновременно.',
  'topic_12047_plant_tissues': 'Почему дерево стоит прямо, а водоросль нет? Потому что у дерева есть механическая ткань — волокна прочнее стали на разрыв. У водоросли — нет.',
  'topic_12048_plant_organs': 'Отрежь ветку ивы — она укоренится. Посади картофельный клубень — вырастет новое растение. Органы растения настолько самостоятельны, что могут дать начало целому организму.',
  'topic_12049_root_nutrition': 'Корень ржи длиной 60 см имеет 14 миллиардов корневых волосков. Если их вытянуть в ряд — получится 10 000 км. От Москвы до Владивостока — 9 000 км.',
  'topic_12050_root_structure': 'Корневой чехлик — единственная часть растения, клетки которой специально «запрограммированы» на смерть. Они жертвуют собой, чтобы корень мог проложить путь через твёрдую почву.',
  'topic_12051_root_zones': 'Корневой волосок живёт 15–20 дней. За это время он поглощает воды в 10–20 раз больше своего объёма. Потом погибает — и на его месте вырастает новый.',
  'topic_12052_root_growth': 'Корни не растут «вниз» — они растут туда, где больше воды. Корень дерева обходит камень, следует за влажной трещиной, разрывает асфальт.',
  'topic_12053_soil': '1 г почвы содержит до 1 миллиарда бактерий. Именно они превращают мёртвые листья в минеральные вещества, которые корень может поглотить.',
  'topic_12054_shoot_buds': 'Почка — это «сжатое» будущее. В почке берёзы, которую ты видишь зимой, уже сложены все будущие листья — крошечные, свёрнутые, готовые к развёртыванию.',
  'topic_12055_leaf_structure': 'Площадь листьев одного взрослого дуба — 400–600 м². Это размер небольшой квартиры. Вся эта поверхность работает как солнечная батарея.',
  'topic_12056_photosynthesis': 'Вся еда, которую ты когда-либо ел, создана из углекислого газа воздуха. Хлеб, мясо, молоко — всё началось с CO₂, который лист превратил в глюкозу с помощью солнечного света.',
  'topic_12057_root_respiration': 'Если залить цветочный горшок водой так, чтобы не осталось воздуха, растение погибнет не от «утопания», а от удушья — корни не могут дышать в бескислородной воде.',
  'topic_12058_stem_respiration': 'Берёза не «потеет» — она целенаправленно открывает чечевички, чтобы газы могли выходить и заходить. Зимой чечевички закрываются — как иллюминаторы на корабле.',
  'topic_12059_organic_inorganic': 'В стебле движется два разных потока: один вверх по сосудам древесины, другой вниз по ситовидным трубкам. Как два встречных конвейера в одном стебле.',
  'topic_12060_stem_axis': 'Стебель бамбука вырастает на 90 см в сутки — рекорд среди растений. Это почти 4 см в час. Ты мог бы увидеть рост, если бы смотрел.',
  'topic_12061_stem_wood': 'Годичное кольцо — это дневник дерева. Широкое кольцо — год был тёплым и влажным. Узкое — засуха или холод. По кольцам учёные восстанавливают климат тысячелетней давности.',
  'topic_12062_vascular_root': 'Вода поднимается на 100 м в стволе секвойи против силы тяжести — без насоса. Её тянут вверх испаряющиеся листья: как соломинка засасывает сок.',
  'topic_12063_transpiration': 'Одно взрослое дерево испаряет 200–400 литров воды в день. Лесной массив площадью 1 га перекачивает за лето столько воды, что без леса земля превратилась бы в пустыню.',
  'topic_12064_meristem_growth': 'У человека кости перестают расти в 18–20 лет. Дерево растёт всю жизнь — благодаря меристеме. Тысячелетняя секвойя продолжает прибавлять в высоту каждый год.',
  'topic_12065_phytohormones': 'Если отрезать верхушку побега, начнут расти боковые почки. Этим пользуются садоводы: прищипка заставляет растение куститься, а не тянуться вверх.',
  'topic_12066_growth_management': 'Топиарное искусство — стрижка деревьев в форме зверей, замков, спиралей — существует 2000 лет. Садовник «обманывает» апикальное доминирование, управляя ростом.',
  'topic_12067_lateral_shoots': 'Урожай пшеницы в Средние века — 3–4 центнера с гектара. Сегодня — 30–50 ц/га. Разница — в понимании того, как управлять ростом растений.',
  'topic_12068_vegetative_reproduction': 'Клубника «убегает» от куста усами — специальными побегами, которые укореняются в нескольких метрах от материнского растения. Так один куст за 3 года занимает территорию 10 м².',
  'topic_12069_clones': 'Все сорта яблонь «Антоновка» в России — клоны одного дерева, найденного в Тульской губернии в XIX веке. Прошло 200 лет, а сорт не изменился — у клона нет вариаций.',
  'topic_12070_flowers_pollination': 'Цветок орхидеи выглядит точно как самка пчелы-андрены. Самец прилетает на спаривание, уходит с пыльцой и летит «спариваться» к следующей орхидее — перенося пыльцу.',
  'topic_12071_fertilization': 'Двойное оплодотворение открыл Сергей Навашин в 1898 году в Киеве. До него учёные не понимали, как в семени образуется запас питания — теперь оказалось, что он тоже «оплодотворяется».',
  'topic_12072_fruit_types': 'Помидор — ягода. Банан — ягода. Арбуз — ягода. Малина — многокостянка. Клубника — ложная ягода (мясистая часть — разросшееся цветоложе). Ботаника не совпадает с кухней.',
  'topic_12073_seed_structure': 'Семя лотоса пролежало в вечной мерзлоте 1200 лет — и взошло. Семя гледичии трёхколючковой хранится 222 года при комнатной температуре. Зародыш внутри ждёт своего часа.',
  'topic_12074_seed_sowing': 'В древнем Египте фермеры замачивали семена в воде со специями — инстинктивно делали стратификацию. Современная агрономия подтвердила: замачивание ускоряет прорастание на 3–5 дней.',
  'topic_12075_plant_development': 'Бамбук цветёт один раз в 120 лет — и погибает. Вся популяция расцветает одновременно, образует семена — и погибает. Следующий «урожай» — через 120 лет.',
  'topic_12076_environment_life_forms': 'Баобаб — дерево или трава? По жизненной форме — дерево. Но его стебель наполовину состоит из воды (до 120 000 литров) — это скорее гигантский суккулент с деревянистым стволом.',
  'topic_12077_cell_lab': 'Роберт Гук увидел первые клетки в 1665 году в срезе пробкового дерева. Он назвал их «клетками» (cellula), потому что они напомнили ему монашеские кельи монастыря.',
  'topic_12078_cell_activity': 'Клетка листа живёт 2–3 недели. За это время она успевает провести тысячи химических реакций, поглотить CO₂, выработать O₂ и синтезировать органику — без отдыха.',
  'topic_12079_tissues_lab': 'Кора дерева на ощупь твёрдая. А под ней — живой слой клеток камбия, которые делятся каждый день. Снаружи — мёртвые клетки-щит, внутри — живое производство.',
  'topic_12080_root_systems_lab': 'У злаков (пшеница, рожь, кукуруза) главный корень отмирает ещё в детстве. Взрослое растение держится в земле только мочковатой системой — сотнями равных корней.',
  'topic_12081_root_modifications': 'Воздушные корни орхидеи снаружи покрыты мёртвыми клетками, которые поглощают влагу прямо из воздуха — как губка. Орхидея не нужна в земле: она живёт на ветках деревьев.',
  'topic_12082_shoot_lab': 'Почки сирени — «парные»: на каждом узле не одна, а две почки. Если срезать одну — вторая активируется. Садоводы используют это при обрезке.',
  'topic_12083_stem_lab': 'Под микроскопом в стебле тыквы видны сосуды диаметром 0,5 мм — это гиганты среди растительных клеток. По ним в жаркий день проходит до литра воды в час.',
  'topic_12084_leaf_lab': 'Восковой налёт на листьях капусты — кутикула. Она водоотталкивающая: капля воды скатывается, как по стеклу. Без неё лист испарял бы воду в 10 раз быстрее.',
  'topic_12085_shoot_modifications_lab': 'Шипы розы — это видоизменённые волоски эпидермиса. Колючки боярышника — видоизменённые побеги. Ус огурца — видоизменённый лист. Всё из одного «материала».',
  'topic_12086_flower_lab': 'Цветок магнолии существует 100 миллионов лет почти без изменений. Динозавры видели точно такие же цветы. Магнолия — одно из первых цветковых растений Земли.',
  'topic_12087_inflorescences_lab': 'Соцветие — не просто «много цветков». Ромашка — это корзинка из 200–300 мелких цветков. То, что кажется одним цветком, на самом деле целая клумба.',
  'topic_12088_fruits': 'Плод авокадо ждал 65 000 лет своего «распространителя» — мегафауны (мамонты, гигантские ленивцы). Они вымерли. Плоды падают под дерево и гниют — никто не уносит семена далеко.',
  'topic_12089_seed_dispersal': 'Семя кокосового ореха путешествует по океану до 5 000 км. Оно не тонет 110 дней и сохраняет всхожесть. Кокосовые пальмы заселили все тропические острова Тихого океана.',
  'topic_12090_plant_metabolism': 'Растение не «ест» почву — оно берёт из неё только воду и минеральные соли. 95% массы дерева — это бывший углекислый газ из воздуха, превращённый фотосинтезом в органику.',
  'topic_12091_mineral_nutrition': 'Хлороз — пожелтение листьев — первый сигнал нехватки железа или азота. Листья желтеют, потому что без этих элементов не образуется хлорофилл.',
  'topic_12092_photosynthesis_lab': 'Если подсветить аквариумное растение элодею, от листьев отделяются пузырьки. Это кислород — продукт фотосинтеза. Чем ярче свет, тем чаще пузырьки.',
  'topic_12093_photosynthesis_role': 'Весь кислород в атмосфере Земли — биогенного происхождения. До появления фотосинтеза (3,5 млрд лет назад) в воздухе не было O₂. Первые фотосинтезирующие бактерии изменили планету.',
  'topic_12094_root_respiration_lab': 'Если набить горшок плотной глинистой почвой — корни задыхаются. Рыхлая почва с порами — это не просто «удобно», это вопрос жизни и смерти для корня.',
  'topic_12095_leaf_stem_respiration': 'Устьичное отверстие шириной 5–10 мкм. Но через 1 мм² листа может одновременно быть открыто 100–300 устьиц. Суммарно лист «дышит» очень активно.',
  'topic_12096_transport_lab': 'Если поставить белую гвоздику в подкрашенную воду — через 2–4 часа лепестки окрасятся. Краситель поднялся по сосудам ксилемы от стебля до каждого лепестка.',
  'topic_12097_excretion_leaf_fall': 'Осенью листья не желтеют — они раскрашиваются. Хлорофилл разрушается первым, и становятся видны каротиноиды (жёлтый) и антоцианы (красный), которые были в листе всё лето.',
  'topic_12098_germination_lab': 'Семена огурца прорастают за 3–5 дней при +25°C. При +15°C — за 10–12 дней. При +10°C — за 20+ дней. Каждые 10 градусов меняют скорость в 2–3 раза.',
  'topic_12099_growth_development_lab': 'Фасоль от семени до цветения — 40–50 дней при комнатной температуре. За это время корень удлиняется на 20–30 см, стебель — на 30–50 см.',
  'topic_12100_reproduction_significance': 'Осина размножается корневыми отпрысками быстрее, чем семенами. Одно дерево за 50 лет образует колонию из 1000 стволов — и все они генетически идентичны.',
  'topic_12101_pollination_fertilization': 'Пчела за один вылет посещает 100–1500 цветков. За сезон одна семья пчёл опыляет несколько миллионов цветков в радиусе 3 км от улья.',
  'topic_12102_fruit_seed_formation': 'Вишня — это один плод из одного пестика. Малина — многокостянка из 30–40 плодиков, каждый из своего пестика. Плод малины — на самом деле 30 плодов на одном цветоложе.',
  'topic_12103_vegetative_reproduction_lab': 'Черенок традесканции в воде пускает корни за 5–7 дней. Каждая клетка меристемы «помнит» полную информацию об организме — из одного листа можно вырастить новое растение.',
  'topic_12104_reserve': 'Ботаника — старейшая наука. Теофраст описал 500 видов растений в IV веке до н.э. Сегодня известно 390 000 видов. Каждый год открывают ещё 2000 новых.'
}

const hook = computed(() => hooks[props.nodeId] || null)
const progress = computed(() => ProgressService.getProgress(props.nodeId))

const backLabel = computed(() => {
  if (!node.value) return 'Назад'
  const block = cs.getBlock(node.value.block)
  return block?.title || 'Назад'
})

function goBack() {
  if (node.value) nav.goToBlock(node.value.block)
  else nav.goToIndex()
}

function shortTitle(title) {
  if (!title) return ''
  return title.length > 40 ? title.substring(0, 40) + '...' : title
}

function onInteractiveCompleted() {
  ProgressService.markCompleted(props.nodeId, 'interactive')
}

function onTrainerCompleted(id, result) {
  ProgressService.markCompleted(props.nodeId, id)
}

function onQuizCompleted(result) {
  ProgressService.markCompleted(props.nodeId, 'quiz')
}

function onNextTopic() {
  if (nextNode.value) nav.goToNode(nextNode.value.id)
}

function markElement(el) {
  ProgressService.markCompleted(props.nodeId, el)
}

onMounted(() => {
  ProgressService.markCompleted(props.nodeId, 'visited')
})
</script>

<style scoped>
.node-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 16px 40px;
}

.node-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0 4px;
}

.back-btn {
  font-size: 14px;
  color: var(--text-muted);
  cursor: pointer;
  background: none;
  border: none;
  padding: 6px 0;
}
.back-btn:hover { color: var(--accent-gold); }

.node-num {
  font-size: 11px;
  color: var(--text-muted);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 2px 8px;
}

.node-title {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 8px;
  margin-top: 8px;
}

.deep-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  background: #3d3520;
  color: var(--accent-gold);
  padding: 3px 10px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.section-wrap { margin-bottom: 24px; }

.section-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border);
}

.node-footer {
  display: flex;
  gap: 10px;
  margin-top: 32px;
}

.nav-btn {
  flex: 1;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 14px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  transition: border-color 0.12s;
}

.nav-btn:hover {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

.next-btn { text-align: right; }

.nav-btn-sub {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 400;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.not-found {
  padding: 40px 16px;
  text-align: center;
  color: var(--text-muted);
}
</style>
