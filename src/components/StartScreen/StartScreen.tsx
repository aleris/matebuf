import type { GemCount } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { formatTime } from '../../utils/timer';
import owlStart from '../../assets/owl_start.png';
import rubySmall from '../../assets/gems/ruby_small.png';
import topazSmall from '../../assets/gems/topaz_small.png';
import sapphireSmall from '../../assets/gems/sapphire_small.png';
import styles from './StartScreen.module.scss';

interface StartScreenProps {
  gems: GemCount;
  bestTime: number | null;
  onStart: () => void;
}

const gemImages = {
  ruby_small: rubySmall,
  topaz_small: topazSmall,
  sapphire_small: sapphireSmall,
};

export const StartScreen = ({ gems, bestTime, onStart }: StartScreenProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.owlContainer}>
        <img src={owlStart} alt="Owl" className={styles.owl} />
      </div>
      
      <h1 className={styles.title}>{t('Mate Buf')}</h1>
      
      {bestTime !== null && (
        <div className={styles.bestTime}>
          <h2 className={styles.bestTimeTitle}>{t('Best Time')}</h2>
          <div className={styles.bestTimeValue}>{formatTime(bestTime)}</div>
        </div>
      )}
      
      <div className={styles.gemCounter}>
        <h2 className={styles.gemTitle}>{t('Gems Collected')}</h2>
        <div className={styles.gemBreakdown}>
          <div className={styles.gemItem}>
            <img src={gemImages.ruby_small} alt={t('Ruby')} className={styles.gemImage} />
            <span className={styles.gemName}>{t('Ruby')}</span>
            <span className={styles.gemCount}>{gems.ruby_small}</span>
          </div>
          <div className={styles.gemItem}>
            <img src={gemImages.topaz_small} alt={t('Topaz')} className={styles.gemImage} />
            <span className={styles.gemName}>{t('Topaz')}</span>
            <span className={styles.gemCount}>{gems.topaz_small}</span>
          </div>
          <div className={styles.gemItem}>
            <img src={gemImages.sapphire_small} alt={t('Sapphire')} className={styles.gemImage} />
            <span className={styles.gemName}>{t('Sapphire')}</span>
            <span className={styles.gemCount}>{gems.sapphire_small}</span>
          </div>
        </div>
      </div>
      
      <button className={styles.startButton} onClick={onStart}>
        {t('Start Game')}
      </button>
    </div>
  );
};
