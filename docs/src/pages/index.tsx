import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Layout from '@theme/Layout';
import type { ReactNode } from 'react';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container text-center">
        <h1 className="hero__title">
          <img
            src="img/hookponent-logo.svg"
            alt="🪝"
            style={{ height: '1em', width: 'auto', verticalAlign: 'middle', marginBottom: '0.2em' }}
          />
          {siteConfig.title}
        </h1>
        <p className="hero__subtitle">React에서 바로 쓸 수 있는 재사용 훅/컴포넌트 모음집</p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/getStarted">
            시작하기
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title}`} description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
