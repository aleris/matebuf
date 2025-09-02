import type { GemType } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { formatTime } from '../../utils/timer';
import chestClosedImg from '../../assets/chest_closed.png';
import chestOpenImg from '../../assets/chest_open.png';
import rubySmall from '../../assets/gems/ruby_small.png';
import topazSmall from '../../assets/gems/topaz_small.png';
import sapphireSmall from '../../assets/gems/sapphire_small.png';
import styles from './EndScreen.module.scss';

interface EndScreenProps {
  chestOpen: boolean;
  rewardGem: GemType | null;
  currentTime: number;
  isNewBestTime: boolean;
  onChestClick: () => void;
  onGrabGem: () => void;
}

const gemImages = {
  ruby_small: rubySmall,
  topaz_small: topazSmall,
  sapphire_small: sapphireSmall,
};

export const EndScreen = ({ chestOpen, rewardGem, currentTime, isNewBestTime, onChestClick, onGrabGem }: EndScreenProps) => {
  const { t } = useTranslation();
  const chestAlt = chestOpen ? "Open Chest" : "Closed Chest";
  
  const getGemName = (gemType: GemType): string => {
    switch (gemType) {
      case 'ruby_small':
        return t('Ruby');
      case 'topaz_small':
        return t('Topaz');
      case 'sapphire_small':
        return t('Sapphire');
      default:
        return gemType;
    }
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('Congratulations!')}</h1>
      <p className={styles.subtitle}>{t('You completed the game!')}</p>

      <div className={styles.timeContainer}>
        <div className={`${styles.currentTime} ${isNewBestTime ? styles.newBestTime : ''}`}>
          <h2 className={styles.timeLabel}>{t('Your Time')}</h2>
          <div className={styles.timeValue}>{formatTime(currentTime)}</div>
          {isNewBestTime && <p className={styles.newBestMessage}>{t('New Best Time!')}</p>}
        </div>
      </div>

      <div className={styles.chestContainer}>
        <button 
          className={styles.chestButton} 
          onClick={onChestClick}
          disabled={chestOpen}
        >
          <img 
            src={chestOpen ? chestOpenImg : chestClosedImg}
            alt={chestAlt}
            className={styles.chest}
          />
        </button>
        {!chestOpen
          ? <p className={styles.info}>{t('Click the chest to get your reward!')}</p>
          : null}

        {chestOpen && rewardGem && (
          <div className={styles.rewardContainer}>
            <div className={styles.gemReward}>
              <img 
                src={gemImages[rewardGem]} 
                alt={getGemName(rewardGem)} 
                className={styles.gemImage}
              />
              <p className={styles.gemName}>{t('You found a ') + getGemName(rewardGem) + '!'}</p>
            </div>
            
            <button className={styles.grabButton} onClick={onGrabGem}>
{t('Grab Gem')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
