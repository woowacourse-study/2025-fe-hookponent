import Heading from '@theme/Heading';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: '📦 NPM Ready',
    Svg: require('@site/static/img/Package.svg').default,
    description: (
      <>
        <p>별도 설정 없이, 한 줄 설치로 바로 프로젝트에 적용할 수 있습니다.</p>
      </>
    ),
  },
  {
    title: '⚡ Developer Friendly',
    Svg: require('@site/static/img/Zap.svg').default,
    description: <>Hookponent는 타입 안정성까지 보장하는 개발자 친화적인 유틸 훅 라이브러리입니다.</>,
  },
  {
    title: '🧩 Reusable Components',
    Svg: require('@site/static/img/Puzzle.svg').default,
    description: <>Hookponent는 자주 쓰는 UI 컴포넌트와 훅을 제공하여 팀 프로젝트 전반에서 재사용성을 극대화합니다.</>,
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4', styles.featureCard)}>
      <div className="text--center">
        <Svg className={styles.featureIcon} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}
export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
