import phoneBed from './assets/img/phone-bed.webp'
import phoneGold from './assets/img/phone-gold.webp'
import phoneDark from './assets/img/phone-dark.webp'
import phoneRed from './assets/img/phone-red.webp'
import phoneAndroid from './assets/img/phone-android.webp'
import phoneWood from './assets/img/phone-wood.webp'
import phoneDesk from './assets/img/phone-desk.webp'
import phoneColors from './assets/img/phone-colors.webp'
import shotNight from './assets/img/shot-night.webp'
import shotCity from './assets/img/shot-city.webp'
import shotClouds from './assets/img/shot-clouds.webp'
import shotValley from './assets/img/shot-valley.webp'
import shotHills from './assets/img/shot-hills.webp'
import shotRoad from './assets/img/shot-road.webp'
import portraitBlue from './assets/img/portrait-blue.webp'
import portraitRed from './assets/img/portrait-red.webp'

export type PhoneColor = {
  id: string
  name: string
  body: string
  frame: string
  swatch: string
  glow: string
}

export const colors: PhoneColor[] = [
  {
    id: 'aurora',
    name: 'Аврора',
    body: 'linear-gradient(150deg, #0b2f36 0%, #157068 45%, #3fd1b5 100%)',
    frame: '#86d9cb',
    swatch: '#3fd1b5',
    glow: '#3fd1b5',
  },
  {
    id: 'violet',
    name: 'Глубокий фиолет',
    body: 'linear-gradient(150deg, #1d0c3d 0%, #4f27a3 50%, #9b6cff 100%)',
    frame: '#9c7ce6',
    swatch: '#7c4dff',
    glow: '#8b6bff',
  },
  {
    id: 'sand',
    name: 'Титан песок',
    body: 'linear-gradient(150deg, #9e8a70 0%, #e6d9c5 50%, #b49c7e 100%)',
    frame: '#d6c5ab',
    swatch: '#d8c7ae',
    glow: '#e8c99a',
  },
  {
    id: 'graphite',
    name: 'Графит',
    body: 'linear-gradient(150deg, #141518 0%, #393b42 50%, #17181b 100%)',
    frame: '#6b6e77',
    swatch: '#3a3c43',
    glow: '#9aa0b4',
  },
]

export const images = {
  shotNight,
  shotCity,
}

export const shots = [
  { src: shotClouds, title: 'Над облаками', meta: '23 мм · f/1.6 · 1/2000' },
  { src: portraitBlue, title: 'Портрет', meta: '85 мм · f/1.8 · Боке AI' },
  { src: shotValley, title: 'Утро в долине', meta: '14 мм · f/2.2 · HDR+' },
  { src: shotRoad, title: 'Дорога', meta: '23 мм · f/1.6 · 1/800' },
  { src: portraitRed, title: 'Улыбка', meta: '70 мм · f/1.9 · Портрет' },
  { src: shotHills, title: 'Горизонт', meta: '23 мм · f/1.6 · RAW' },
  { src: shotNight, title: 'Ночное небо', meta: '23 мм · f/1.6 · 10 с · Ночь' },
]

export const lifestyle = [
  { src: phoneGold, caption: 'Всегда включённый экран' },
  { src: phoneBed, caption: 'Утро начинается тут' },
  { src: phoneColors, caption: 'Цвета, которые хочется трогать' },
  { src: phoneDark, caption: 'Безрамочный дисплей' },
  { src: phoneWood, caption: 'Минимум деталей' },
  { src: phoneRed, caption: 'Смелый характер' },
  { src: phoneAndroid, caption: 'AURA OS 3' },
  { src: phoneDesk, caption: 'Всё под рукой' },
]

export type Model = {
  id: string
  name: string
  tagline: string
  price: number
  color: PhoneColor
  cameras: 2 | 3
  size: number
  highlights: string[]
}

export const models: Model[] = [
  {
    id: 'lite',
    name: 'AURA X Lite',
    tagline: 'Всё главное. Ничего лишнего.',
    price: 599,
    color: colors[2],
    cameras: 2,
    size: 0.9,
    highlights: ['6.4″ OLED, 120 Гц', 'Чип N1 Lite', '50 МП двойная камера', '5000 мА·ч, 67 Вт'],
  },
  {
    id: 'x',
    name: 'AURA X',
    tagline: 'Флагман для каждого дня.',
    price: 899,
    color: colors[0],
    cameras: 3,
    size: 0.97,
    highlights: ['6.7″ Super Aurora, 144 Гц', 'Чип N1, 3 нм', '200 МП тройная камера', '5500 мА·ч, 100 Вт'],
  },
  {
    id: 'ultra',
    name: 'AURA X Ultra',
    tagline: 'Без компромиссов. Вообще.',
    price: 1199,
    color: colors[1],
    cameras: 3,
    size: 1,
    highlights: ['6.8″ LTPO, 3000 нит', 'Чип N1 Pro', 'Перископ 10× оптика', '6000 мА·ч, 120 Вт'],
  },
]

export const specRows: { label: string; values: [string, string, string] }[] = [
  { label: 'Дисплей', values: ['6.4″ OLED 120 Гц', '6.7″ OLED 144 Гц', '6.8″ LTPO 144 Гц'] },
  { label: 'Яркость', values: ['1600 нит', '2500 нит', '3000 нит'] },
  { label: 'Процессор', values: ['N1 Lite', 'N1 · 3 нм', 'N1 Pro · 3 нм'] },
  { label: 'Основная камера', values: ['50 МП', '200 МП', '200 МП'] },
  { label: 'Зум', values: ['2× цифровой', '3× оптика', '10× перископ'] },
  { label: 'Батарея', values: ['5000 мА·ч', '5500 мА·ч', '6000 мА·ч'] },
  { label: 'Зарядка', values: ['67 Вт', '100 Вт', '120 Вт'] },
  { label: 'Память', values: ['128 / 256 ГБ', '256 / 512 ГБ', '512 ГБ / 1 ТБ'] },
  { label: 'Защита', values: ['IP68', 'IP68', 'IP69'] },
  { label: 'Спутниковая связь', values: ['—', '—', 'Да'] },
]

export const faq = [
  {
    q: 'Когда начнутся продажи AURA X?',
    a: 'Предзаказ открыт уже сейчас, а первые поставки начнутся 20 ноября. Все, кто оформит предзаказ, получат устройство в первой волне.',
  },
  {
    q: 'Есть ли в комплекте зарядное устройство?',
    a: 'Да. В коробке — зарядка GaN мощностью до 120 Вт, кабель USB-C и прозрачный чехол из переработанного пластика.',
  },
  {
    q: 'Сколько лет будут приходить обновления?',
    a: 'Мы гарантируем 7 лет обновлений AURA OS и патчей безопасности для всех моделей линейки X.',
  },
  {
    q: 'Можно ли пользоваться двумя SIM-картами?',
    a: 'Да, AURA X поддерживает физическую nano-SIM и две eSIM одновременно — с поддержкой 5G на обеих линиях.',
  },
  {
    q: 'Что входит в гарантию?',
    a: 'Два года официальной гарантии и один бесплатный ремонт экрана в течение первого года при случайном повреждении.',
  },
]

export const navLinks = [
  { id: 'design', label: 'Дизайн' },
  { id: 'features', label: 'Возможности' },
  { id: 'camera', label: 'Камера' },
  { id: 'performance', label: 'Чип' },
  { id: 'models', label: 'Модели' },
  { id: 'faq', label: 'FAQ' },
]
