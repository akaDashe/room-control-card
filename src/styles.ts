import { css } from "lit";

export const cardStyles = css`
  :host {
    --rcc-icon-inactive: var(
      --disabled-color,
      rgba(var(--rgb-primary-text-color, 255, 255, 255), 0.25)
    );
    --rcc-value-size: 12px;
    --rcc-name-size: 16px;
    --rcc-temp-size: 12px;
  }

  ha-card {
    overflow: hidden;
    padding: 10px 12px;
    cursor: pointer;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 56px;
    -webkit-tap-highlight-color: transparent;
    transition: transform 0.12s ease;
    user-select: none;
  }

  ha-card:active {
    transform: scale(0.98);
    background: rgba(var(--rgb-primary-text-color, 255, 255, 255), 0.06);
  }

  /* Card layout with optional icon */
  .card-layout {
    display: flex;
    align-items: stretch;
    gap: 6px;
    height: 100%;
    min-height: inherit;
    position: relative;
  }

  .room-icon-wrap {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgba(var(--rgb-primary-text-color, 255, 255, 255), 0.08);
    border: 1.5px solid rgba(var(--rgb-primary-text-color, 255, 255, 255), 0.12);
    align-self: flex-end;
    margin-left: -46px;
    margin-top: -20px;
    margin-bottom: -24px;
  }

  .room-icon {
    --mdc-icon-size: 46px;
    display: flex;
    color: var(--secondary-text-color);
  }

  .card-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  /* Top row */
  .top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    line-height: 1.2;
  }

  .room-name {
    font-size: var(--rcc-name-size);
    font-weight: 700;
    color: var(--primary-text-color);
    letter-spacing: 0.01em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-shrink: 1;
    min-width: 0;
  }

  .top-right-icons {
    display: flex;
    flex-wrap: nowrap;
    gap: 2px;
    align-items: center;
    flex-shrink: 0;
    line-height: 1;
  }

  .top-right-icons .entity-icon {
    --mdc-icon-size: 20px;
  }

  .top-right-icons .entity-item-wrap.value-only {
    display: inline-flex;
    align-items: center;
    height: 20px;
  }

  /* Bottom row */
  .bottom-row {
    display: flex;
    align-items: flex-end;
    gap: 4px;
    margin-top: 2px;
  }

  .bottom-left-icons {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
    align-items: center;
    flex: 1 1 auto;
    min-width: 0;
  }

  .bottom-right-icons {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
    align-items: center;
    flex: 1 1 auto;
    min-width: 0;
    justify-content: flex-end;
  }

  .bottom-right-icons .entity-item-wrap.value-only {
    display: inline-flex;
    align-items: center;
    height: 20px;
  }

  /* Entity items */
  .entity-item-wrap {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    line-height: 1;
  }

  .entity-icon {
    --mdc-icon-size: 20px;
    transition: color 0.25s ease;
    display: flex;
  }

  .entity-icon.inactive {
    color: var(--rcc-icon-inactive);
  }

  .entity-value {
    font-size: var(--rcc-value-size);
    font-weight: 500;
    letter-spacing: -0.02em;
    line-height: 1;
    white-space: nowrap;
    padding-right: 1px;
  }

  .entity-item-wrap.value-left {
    gap: 0;
  }

  .entity-item-wrap.value-left .entity-value {
    margin-right: 2px;
  }

  .entity-item-wrap.value-left .entity-icon {
    margin-right: -2px;
  }

  .entity-item-wrap.value-only {
    align-items: center;
    line-height: 1.2;
  }

  .entity-item-wrap.value-only .entity-value {
    font-size: var(--rcc-temp-size);
    font-weight: 500;
    align-self: center;
  }

  .top-right-icons .entity-item-wrap.value-only .entity-value {
    font-size: var(--rcc-temp-size);
  }

  /* Responsive */
  @media screen and (max-width: 800px) {
    ha-card {
      padding: 8px 10px;
    }

    :host {
      --rcc-value-size: 12px;
      --rcc-name-size: 15px;
      --rcc-temp-size: 12px;
    }

    .top-right-icons .entity-icon {
      --mdc-icon-size: 20px;
    }

    .entity-icon {
      --mdc-icon-size: 18px;
    }

    .bottom-row {
      margin-top: 2px;
    }
  }
`;
