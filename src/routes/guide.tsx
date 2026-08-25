import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  Clapperboard,
  Clock,
  Compass,
  Film,
  Globe,
  Landmark,
  Music,
  Play,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { EpLink } from "@/components/ep-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GUIDE_OSCAR_CHIPS, thumbnailOf } from "@/lib/episodes";

export const Route = createFileRoute("/guide")({ component: GuidePage });

function Section({
  title,
  icon: Icon,
  color,
  children,
}: {
  title: string;
  icon: LucideIcon;
  color: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-5">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="font-display text-xl md:text-2xl text-foreground">
          {title}
        </h2>
      </div>
      <div className="text-sm md:text-base text-foreground/80 leading-relaxed space-y-3 pl-[52px]">
        {children}
      </div>
    </section>
  );
}

function Era({
  num,
  title,
  range,
  thumbEp,
  highlights,
}: {
  num: string;
  title: string;
  range: string;
  thumbEp: number;
  highlights: { text: string; ep?: number }[];
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-xl bg-cheese-yellow/15 flex items-center justify-center text-cheese-yellow font-display text-sm">
          {num}
        </div>
        <div className="w-0.5 flex-1 bg-linear-to-b from-cheese-yellow/30 to-transparent mt-2 rounded-full" />
      </div>
      <div className="pb-2 flex-1">
        <div className="flex items-start gap-3 mb-3">
          <div>
            <h4 className="font-bold text-foreground text-sm md:text-base">
              {title}
            </h4>
            <Badge
              variant="outline"
              className="text-[10px] px-2 py-0 mt-1 rounded-full font-bold"
            >
              {range}
            </Badge>
          </div>
          <Link
            to="/watch/$id"
            params={{ id: String(thumbEp) }}
            className="w-16 h-11 rounded-xl overflow-hidden shrink-0 ml-auto border-2 border-border hover:border-primary/30 transition-colors"
          >
            <img
              src={thumbnailOf(thumbEp)}
              alt={title}
              className="w-full h-full object-cover hover:scale-110 transition-transform"
              loading="lazy"
            />
          </Link>
        </div>
        <ul className="space-y-1.5">
          {highlights.map((item) => (
            <li
              key={item.text}
              className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cheese-yellow/50 mt-1.5 shrink-0" />
              {item.ep ? (
                <Link
                  to="/watch/$id"
                  params={{ id: String(item.ep) }}
                  className="hover:text-primary transition-colors"
                >
                  {item.text}
                </Link>
              ) : (
                <span>{item.text}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const OSCAR_WINS = [
  { ep: 11, title: "The Yankee Doodle Mouse", titleCn: "扬基老鼠", year: 1943, note: "首次获奖，战争隐喻鲜明" },
  { ep: 17, title: "Mouse Trouble", titleCn: "鼠患重重", year: 1944, note: "'发明式暴力'笑料巅峰" },
  { ep: 22, title: "Quiet Please!", titleCn: "安静，请！", year: 1945, note: "配角Spike主导的经典" },
  { ep: 29, title: "The Cat Concerto", titleCn: "猫的协奏曲", year: 1946, note: "音乐与动作精密同步的巅峰" },
  { ep: 40, title: "The Little Orphan", titleCn: "小孤儿", year: 1948, note: "配角Nibbles的加冕之作" },
  { ep: 65, title: "The Two Mouseketeers", titleCn: "两个火枪鼠", year: 1951, note: "法国火枪手戏仿的杰作" },
  { ep: 75, title: "Johann Mouse", titleCn: "约翰鼠", year: 1952, note: "维也纳华尔兹，最后一座奥斯卡" },
];

const CHARACTERS = [
  { name: "Spike 斗牛犬", debutEp: 5, thumb: 22, desc: "系列中仅次于Tom和Jerry的第三大人气角色。从凶猛的大狗逐渐发展为有血有肉的父亲形象。" },
  { name: "Nibbles / Tuffy 小灰鼠", debutEp: 24, thumb: 40, desc: "Jerry的养子/侄子。贪吃、天真、惹祸不断。法国火枪手系列的核心角色，贡献了两次奥斯卡。" },
  { name: "Tyke 小狗", debutEp: 44, thumb: 44, desc: "Spike的儿子。温顺可爱，是Spike最在意的宝贝。Spike-Tyke父子线后来发展为独立衍生系列。" },
  { name: "Quacker 小鸭子", debutEp: 47, thumb: 47, desc: "爱哭鼻子的小鸭子。经历了学游泳、迁徙、自卑等多个成长阶段，角色弧线在配角中最为丰富。" },
  { name: "Butch 黑猫", debutEp: 9, thumb: 9, desc: "Tom的主要情敌和竞争对手。角色可塑性极强：时而是恋爱情敌，时而是灭鼠工，时而伪装成婴儿。" },
  { name: "Toodles Galore", debutEp: 23, thumb: 23, desc: "Tom和Butch共同追求的美丽母猫。使'Tom的恋爱注定失败'成为了系列的长期叙事主题。" },
];

const MUSIC_EPS = [
  { ep: 16, title: "Puttin' on the Dog", note: "十二音序列技法实验" },
  { ep: 26, title: "Solid Serenade", note: "流行歌曲驱动型追逐" },
  { ep: 29, title: "The Cat Concerto", note: "李斯特《匈牙利狂想曲第二号》" },
  { ep: 52, title: "Hollywood Bowl", note: "施特劳斯《蝙蝠序曲》" },
  { ep: 75, title: "Johann Mouse", note: "维也纳华尔兹" },
  { ep: 96, title: "Pecos Pest", note: "乡村音乐吉他" },
];

const MARKET = [
  { label: "影院热度", content: "1954-55年连续第4年位居《Boxoffice Barometer》短片榜首，过去7年中有5年居首。" },
  { label: "重映价值", content: "1961年重映版甚至能压过新出的Bugs Bunny。MGM关闭新制短片的重要原因之一，正是旧作重映收益已接近新片。" },
  { label: "漫画授权", content: "1942年起进入漫画市场，Dell系列达212期，后续延续到1984年第344期。" },
  { label: "电视长尾", content: "1965-1972年在CBS整理播映，院线短片完成向电视资产的转化。" },
  { label: "当代修复", content: "华纳2025-2026年官方整套修复发行全部114集，证明其依然是可持续变现的经典库内容。" },
  { label: "全球流通", content: "角色几乎不说话的设计，使其能跨越语言障碍在全球市场自由流通，成为最早的全球化超级IP之一。" },
];

function GuidePage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-linear-to-br from-tom-blue to-accent-warm py-10 md:py-14">
        <div className="absolute inset-0 pattern-dots-hero" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <img
            src="/jerry.png"
            alt="Jerry"
            className="w-44 md:w-56 h-auto rounded-2xl shadow-2xl border-4 border-white/20 mb-5 mx-auto"
          />
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-bold rounded-full px-3 py-1.5 mb-3 border border-white/20">
            <BookOpen className="w-3.5 h-3.5" />
            深度导读
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-white mb-3 leading-tight tracking-tight">
            猫和老鼠
            <span className="text-cheese-yellow ml-2">观影指南</span>
          </h1>
          <p className="text-white/80 text-base md:text-lg mb-5 max-w-lg mx-auto leading-relaxed font-semibold">
            从1940到1958，114集院线动画短片，7座奥斯卡，一部跨越时代的经典
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="bg-cheese-yellow hover:bg-cheese-yellow/90 text-foreground font-extrabold rounded-full px-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              asChild
            >
              <Link to="/">
                <Clapperboard className="w-4 h-4 mr-2" />
                浏览全部剧集
              </Link>
            </Button>
            <Button
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white font-bold rounded-full px-8 border-2 border-white/25 backdrop-blur-sm"
              asChild
            >
              <Link to="/watch/$id" params={{ id: "1" }}>
                <Play className="w-4 h-4 mr-2" fill="currentColor" />
                开始观看
              </Link>
            </Button>
          </div>
          <div className="flex gap-2 justify-center mt-7 overflow-x-auto scrollbar-hide pb-1">
            {GUIDE_OSCAR_CHIPS.map((id) => (
              <Link
                key={id}
                to="/watch/$id"
                params={{ id: String(id) }}
                className="relative rounded-xl overflow-hidden shrink-0 w-20 h-14 md:w-24 md:h-16 group border-2 border-white/20 hover:border-cheese-yellow transition-all shadow-md"
              >
                <img
                  src={thumbnailOf(id)}
                  alt={`EP ${id}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-0.5 left-1 flex items-center gap-0.5">
                  <Award className="w-2.5 h-2.5 text-cheese-yellow" />
                  <span className="text-[9px] font-extrabold text-white drop-shadow">
                    EP {id}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 md:py-16 max-w-4xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {[
            { icon: Film, label: "院线短片", value: "114集", color: "text-tom-blue" },
            { icon: Award, label: "奥斯卡获奖", value: "7次", color: "text-cheese-yellow" },
            { icon: Clock, label: "跨越年代", value: "1940-1958", color: "text-accent-warm" },
            { icon: Globe, label: "全球传播", value: "无对白", color: "text-jerry-brown" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-2xl p-5 text-center border-2 border-border shadow-[0_2px_12px_hsl(28_40%_50%_/_0.08)] hover:shadow-[0_12px_28px_hsl(28_40%_50%_/_0.15)] hover:border-tom-blue/30 transition-all hover:-translate-y-0.5"
            >
              <div
                className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center bg-muted ${stat.color}`}
              >
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="font-display text-xl md:text-2xl text-foreground">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <Section title="这是一个怎样的系列？" icon={BookOpen} color="bg-tom-blue/10 text-tom-blue">
          <p>
            老版《猫和老鼠》是米高梅（MGM）旗下由William Hanna与Joseph Barbera主导的院线动画短片系列。从1940年的试映片
            <EpLink ep={1}>《Puss Gets the Boot》（第1集）</EpLink>
            到1958年的收官作
            <EpLink ep={114}>《Tot Watchers》（第114集）</EpLink>
            ，共114部短片，累计获得13次奥斯卡最佳动画短片提名、7次获奖——这使它成为黄金时代院线动画中"奖项-票房-重播"复合竞争力最强的系列之一。
          </p>
          <p>
            它的工业核心并不只是"猫追鼠"这个简单的点子，而是一套极度高效且精炼的生产系统：Barbera负责故事板、人物设计与构图，Hanna负责timing、镜头节奏、动画调度与拟声。两人从不先写完成剧本，而是先确定笑料结构与动作设计。
          </p>
          <p>
            角色几乎不说话，却能跨越语言市场在全世界自由流通——这是Hanna和Barbera的一个关键决策。正是"无对白"这一特点，让Tom和Jerry从美国院线走向了全球每一个角落。
          </p>
        </Section>

        <Section title="创作者们" icon={Users} color="bg-jerry-brown/10 text-jerry-brown">
          <h4 className="font-display text-lg text-foreground mb-2">
            William Hanna & Joseph Barbera
          </h4>
          <p>
            这对搭档的分工被Television Academy精确概括为"Bill directs, Joe draws"——Hanna负责导演与技术管理，Barbera负责绘画与创意。Barbera在回忆中说过："I storyboarded all the Tom and Jerry's"。两人的合作从1940年一直持续到MGM动画部门1957年关闭。被解雇后，他们创建了Hanna-Barbera Productions，开创了电视动画的新纪元。
          </p>
          <h4 className="font-display text-lg text-foreground mb-2 mt-6">
            Scott Bradley — 第三主角
          </h4>
          <p>
            配乐师Scott Bradley是Tom和Jerry真正的"第三主角"。学术研究指出，他把持续音乐拍点、古典乐引用、现代主义和声与动作同步结合起来，显著塑造了系列的喜剧时间感。在
            <EpLink ep={16}>《Puttin' on the Dog》（第16集）</EpLink>
            中他甚至使用了十二音序列技法——这在当时的商业动画中极为罕见。
            <EpLink ep={29}>《The Cat Concerto》（第29集）</EpLink>
            中他将李斯特的《匈牙利狂想曲第二号》与角色的每一个动作精密同步，被视为动画音乐史上的巅峰之作。
          </p>
          <h4 className="font-display text-lg text-foreground mb-2 mt-6">制片管理</h4>
          <p>
            系列的前96集由Fred Quimby担任制片人，
            <EpLink ep={97}>第97集</EpLink>
            至
            <EpLink ep={114}>第114集</EpLink>
            改由Hanna与Barbera兼任制片与导演。这一转变标志着两位创作者从"导演"向"制片管理者"的角色过渡——也为他们日后创建独立公司积累了管理经验。
          </p>
        </Section>

        <Section title="奥斯卡辉煌" icon={Award} color="bg-cheese-yellow/15 text-cheese-yellow">
          <p>7座奥斯卡最佳动画短片奖使Tom和Jerry成为动画史上获奖最多的系列之一：</p>
          <div className="space-y-2.5 mt-4">
            {OSCAR_WINS.map((item) => (
              <Link
                key={item.ep}
                to="/watch/$id"
                params={{ id: String(item.ep) }}
                className="flex items-center gap-3 p-3 rounded-xl bg-card border-2 border-border shadow-sm hover:border-tom-blue/30 transition-all group hover:-translate-y-0.5 hover:shadow-[0_12px_28px_hsl(28_40%_50%_/_0.15)]"
              >
                <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0 border border-border">
                  <img
                    src={thumbnailOf(item.ep)}
                    alt={item.titleCn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-primary text-sm">
                      第{item.ep}集
                    </span>
                    <span className="font-bold text-sm text-foreground">
                      {item.titleCn}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">
                      ({item.year})
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                    {item.note}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground font-medium">
            此外还有6次提名：
            <EpLink ep={1} />、
            <EpLink ep={3} />、
            <EpLink ep={30} />、
            <EpLink ep={41} />、
            <EpLink ep={57} />
            和
            <EpLink ep={89} />。
          </p>
        </Section>

        <Section title="音乐：看不见的剪辑器" icon={Music} color="bg-accent-warm/10 text-accent-warm">
          <p>
            Tom和Jerry的配乐不是简单的背景音乐，而是与画面完全同步的叙事工具。Scott Bradley的"持续配乐"（continuous scoring）手法意味着：每一个追逐动作、每一次碰撞、每一个表情变化，都有精确对应的音乐拍点。学术研究把这种效果概括为"常驻音乐对comic timing的塑形"——音乐变成了"看不见的剪辑器"。
          </p>
          <p>
            Bradley的音乐类型跨度极大：从古典音乐（李斯特、施特劳斯）到爵士乐，从流行歌曲到先锋实验。他在《Puttin' on the Dog》中使用的十二音序列技法，把MGM卡通音乐推向了现代主义边缘——这在当时的商业动画中几乎是不可想象的。
          </p>
          <div className="bg-card border border-border rounded-2xl p-4 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <Compass className="w-4 h-4 text-cheese-yellow" />
              <span className="font-bold text-foreground text-sm">
                值得特别关注的音乐名集
              </span>
            </div>
            <div className="space-y-1.5">
              {MUSIC_EPS.map((item) => (
                <Link
                  key={item.ep}
                  to="/watch/$id"
                  params={{ id: String(item.ep) }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-colors group"
                >
                  <div className="w-11 h-8 rounded-lg overflow-hidden shrink-0 border border-border">
                    <img
                      src={thumbnailOf(item.ep)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold">
                      <span className="text-primary">第{item.ep}集</span>
                      <span className="text-foreground"> 《{item.title}》</span>
                    </span>
                    <p className="text-xs text-muted-foreground font-medium">
                      {item.note}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Section>

        <Section title="角色宇宙" icon={Users} color="bg-tom-blue/10 text-tom-blue">
          <p>Tom和Jerry不只是一对猫鼠。经过114集的发展，系列建立了一个完整的角色宇宙：</p>
          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            {CHARACTERS.map((item) => (
              <Link
                key={item.name}
                to="/watch/$id"
                params={{ id: String(item.debutEp) }}
                className="bg-card border-2 border-border rounded-2xl p-4 shadow-[0_2px_12px_hsl(28_40%_50%_/_0.08)] hover:border-tom-blue/30 transition-all group block hover:-translate-y-0.5 hover:shadow-[0_12px_28px_hsl(28_40%_50%_/_0.15)]"
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border-2 border-border group-hover:border-primary/30 transition-colors">
                    <img
                      src={thumbnailOf(item.thumb)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                      {item.name}
                    </h4>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-2 py-0 rounded-full font-bold mt-0.5"
                    >
                      第{item.debutEp}集首登
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </Section>

        <Section title="四个创作阶段" icon={Clock} color="bg-cheese-yellow/15 text-cheese-yellow">
          <div className="space-y-6">
            <Era
              num="01"
              title="试片到奖项品牌 (1940-1947)"
              range="第1-30集"
              thumbEp={29}
              highlights={[
                { text: "从试映片起步，Tom最初叫Jasper，造型更接近真实猫" },
                { text: "首次奥斯卡获奖，系列从'热门短片'升级为'奖项品牌'", ep: 11 },
                { text: "Spike、Butch等核心配角陆续登场，从双人追逐扩展为三角喜剧" },
                { text: "将音乐炫技推向巅峰的《The Cat Concerto》", ep: 29 },
                { text: "Scott Bradley确立持续配乐风格，音乐成为叙事工具" },
              ]}
            />
            <Era
              num="02"
              title="成熟高峰与配角扩张 (1947-1951)"
              range="第31-60集"
              thumbEp={40}
              highlights={[
                { text: "配角体系大规模扩容：Nibbles、Tyke、Quacker陆续登场" },
                { text: "《The Little Orphan》获得第5座奥斯卡", ep: 40 },
                { text: "题材多样化：海滨、荒岛、台球、网球等场景" },
                { text: "编集片开始出现，预示库存镜头将成为成本管理手段" },
                { text: "部分争议性内容在电视时代面临删改" },
              ]}
            />
            <Era
              num="03"
              title="题材拓展与技术转型 (1951-1955)"
              range="第61-90集"
              thumbEp={75}
              highlights={[
                { text: "火枪手子系列诞生，获得奥斯卡获奖与提名", ep: 65 },
                { text: "拿下最后一座奥斯卡的《Johann Mouse》", ep: 75 },
                { text: "CinemaScope宽银幕开始引入，画幅从4:3向宽银幕过渡" },
                { text: "机器猫Mechano登场，预见了'自动化取代人力'的主题", ep: 70 },
                { text: "女佣Mammy Two Shoes退场，为电视时代的内容适应做准备" },
              ]}
            />
            <Era
              num="04"
              title="晚期与终曲 (1955-1958)"
              range="第91-114集"
              thumbEp={103}
              highlights={[
                { text: "Hanna与Barbera兼任制片，从导演向管理者过渡" },
                { text: "宽银幕重拍策略：用旧故事适配新放映条件，节省成本" },
                { text: "以罕见悲剧调突破品牌边界的《Blue Cat Blues》", ep: 103 },
                { text: "以'合作救婴'收尾的最终集《Tot Watchers》", ep: 114 },
                { text: "1957年MGM关闭动画部门，一个时代落幕" },
              ]}
            />
          </div>
        </Section>

        <Section title="制作工艺" icon={Clapperboard} color="bg-jerry-brown/10 text-jerry-brown">
          <p>
            在配乐方面，Scott Bradley延续了他一贯的高水准。他将古典音乐元素与流行音乐风格巧妙融合，为每一个动作和表情都配上了恰到好处的音乐。Bradley的配乐风格后来影响了整整一代动画配乐师。
          </p>
          <p>
            每部短片在制作期间都经历了多次修改。Hanna和Barbera团队对每一个追逐场景都进行了反复推敲，确保节奏紧凑、笑料密集。据制作记录显示，每一集大约需要绘制15,000到20,000张画稿，整个制作周期约为6-8周。
          </p>
          <p>
            背景绘制同样精益求精。米高梅动画部门的背景画师们以精湛的水彩技法，营造出了温馨而富有生活气息的场景。每一个房间、每一件家具都经过精心设计，既要满足故事需要，又要为追逐场景提供足够的道具和空间。
          </p>
          <p>
            在当年的影院放映中，Tom和Jerry获得了观众的热烈反响。在那个没有电视的年代，观众去影院看电影时，在正片之前放映的动画短片是最受期待的节目之一。Tom和Jerry系列凭借其精湛的制作和无穷的创意，成为了米高梅最受欢迎的动画品牌。
          </p>
          <p>
            从动画史的角度来看，这一时期的Tom和Jerry代表了美国经典动画的最高水平。全手绘的制作方式、精心设计的配乐、充满想象力的情节设计——这些元素共同构成了一个至今仍被视为动画艺术标杆的系列。
          </p>
        </Section>

        <Section title="市场影响与文化遗产" icon={Landmark} color="bg-accent-warm/10 text-accent-warm">
          <p>
            老版《猫和老鼠》的价值远不止于艺术成就。根据业界资料，它在"奖项-影院-重映-漫画-电视-家庭影像-修复发行"这条完整价值链上持续成功：
          </p>
          <div className="space-y-2.5 mt-4">
            {MARKET.map((item) => (
              <div
                key={item.label}
                className="flex gap-3 items-start bg-card border border-border rounded-xl p-3"
              >
                <span className="w-2 h-2 rounded-full bg-accent-warm mt-1.5 shrink-0" />
                <div>
                  <span className="font-bold text-foreground text-sm">
                    {item.label}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1 font-medium">
                    {item.content}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <section className="mt-12 bg-linear-to-br from-card to-muted border-2 border-border rounded-2xl p-6 md:p-8">
          <h3 className="font-display text-xl text-foreground mb-5 flex items-center gap-2">
            <Compass className="w-5 h-5 text-cheese-yellow" />
            观看建议
          </h3>
          <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
            <div className="bg-background/60 rounded-xl p-4 border border-border">
              <span className="font-bold text-foreground">如果你是第一次看：</span>
              <span className="ml-1">
                建议从
                <EpLink ep={1} />
                按顺序看起。前30集可以让你完整见证角色和风格的成型过程——从Tom最初粗犷的造型到后来流线型的设计，从简单的猫鼠追逐到复杂的三角关系。
              </span>
            </div>
            <div className="bg-background/60 rounded-xl p-4 border border-border">
              <span className="font-bold text-foreground">如果你想看精华：</span>
              <span className="ml-1">
                优先选择7部奥斯卡获奖作品（
                <EpLink ep={11} />、
                <EpLink ep={17} />、
                <EpLink ep={22} />、
                <EpLink ep={29} />、
                <EpLink ep={40} />、
                <EpLink ep={65} />、
                <EpLink ep={75} />
                ）。其中
                <EpLink ep={29}>《The Cat Concerto》（第29集）</EpLink>
                是公认的巅峰之作。
              </span>
            </div>
            <div className="bg-background/60 rounded-xl p-4 border border-border">
              <span className="font-bold text-foreground">如果你对音乐感兴趣：</span>
              <span className="ml-1">
                <EpLink ep={16} />
                （十二音实验）、
                <EpLink ep={29} />
                （李斯特）、
                <EpLink ep={52} />
                （施特劳斯）和
                <EpLink ep={75} />
                （维也纳华尔兹）是必看的音乐名集。
              </span>
            </div>
            <div className="bg-background/60 rounded-xl p-4 border border-border">
              <span className="font-bold text-foreground">如果你想看温情故事：</span>
              <span className="ml-1">
                <EpLink ep={42} />
                （天堂审判）、
                <EpLink ep={87} />
                （丑小鸭自卑）、
                <EpLink ep={97} />
                （小鸭认妈妈）和
                <EpLink ep={103} />
                （蓝猫忧郁）展示了系列超越纯喜剧的叙事深度。
              </span>
            </div>
          </div>
          <div className="mt-6">
            <Button
              asChild
              className="bg-accent-warm hover:bg-accent-warm/90 text-accent-foreground font-extrabold rounded-full px-6 shadow-md"
            >
              <Link to="/watch/$id" params={{ id: "1" }}>
                <Play className="w-4 h-4 mr-2" fill="currentColor" />
                开始观看第1集
              </Link>
            </Button>
          </div>
        </section>

        <p className="text-xs text-muted-foreground mt-8 text-center leading-relaxed font-medium">
          本导读内容整理自MGM档案、奥斯卡官方记录、美国国会图书馆模型纸馆藏、
          Television Academy口述史、Scott Bradley学术研究、《Boxoffice
          Barometer》影院数据 及华纳官方修复资料等多方来源。
        </p>
      </div>
    </div>
  );
}
