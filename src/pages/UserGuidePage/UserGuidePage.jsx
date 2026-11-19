// Framework and third-party non-ui
import React from 'react';

// Hooks, context, and constants
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContextSimple';

// Third-party components (buttons, icons, etc.)
import { Button, Icon } from '@trussworks/react-uswds';

import './UserGuidePage.scss';

/**
 * User guide. The text is in the translations under UserGuide.Sections: each section has an Id,
 * a Title, Blocks (a paragraph string or a list { List: [{ Term, Text }] }) and optional Images
 * ([{ File, Alt }] in public/images/user-guide/, made with scripts/guide-screenshots.mjs).
 */
const UserGuidePage = () => {
    const { t } = useTranslation();
    const { closeUserGuide } = useAppContext();
    const sections = t('UserGuide.Sections', { returnObjects: true });

    const renderBlock = (block, idx) =>
        typeof block === 'string' ? (
            <p key={idx}>{block}</p>
        ) : (
            <ul key={idx}>
                {block.List.map(({ Term, Text }) => (
                    <li key={Term ?? Text}>
                        {Term && <strong>{Term}</strong>}
                        {Term && ' – '}
                        {Text}
                    </li>
                ))}
            </ul>
        );

    return (
        <div className="userGuidePage">
            <Button className="userGuidePage__back usa-button--ghost-light" onClick={closeUserGuide}>
                <Icon.ArrowBack aria-hidden size={2} />
                {t('App.BackButtonText')}
            </Button>

            <article className="userGuidePage__content">
                <h1 className="userGuidePage__title">{t('UserGuide.Title')}</h1>
                <p className="userGuidePage__intro">{t('UserGuide.Intro')}</p>

                <nav className="userGuidePage__toc" aria-label={t('UserGuide.Contents')}>
                    <h2>{t('UserGuide.Contents')}</h2>
                    <ol>
                        {sections.map((section) => (
                            <li key={section.Id}>
                                <a
                                    href={`#guide-${section.Id}`}
                                    onClick={(event) => {
                                        // Scroll without adding the section to the address
                                        event.preventDefault();
                                        document
                                            .getElementById(`guide-${section.Id}`)
                                            ?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    {section.Title}
                                </a>
                            </li>
                        ))}
                    </ol>
                </nav>

                {sections.map((section) => (
                    <section key={section.Id} id={`guide-${section.Id}`} className="userGuidePage__section">
                        <h2>{section.Title}</h2>
                        {section.Blocks.map(renderBlock)}
                        {section.Images && (
                            <div
                                className={`userGuidePage__images ${
                                    section.Images.length > 1 ? 'userGuidePage__images--pair' : ''
                                }`}
                            >
                                {section.Images.map(({ File, Alt }) => (
                                    <img
                                        key={File}
                                        // Taken at 2x: shown at the size the element has in the app
                                        srcSet={`${import.meta.env.BASE_URL}images/user-guide/${File} 2x`}
                                        src={`${import.meta.env.BASE_URL}images/user-guide/${File}`}
                                        alt={Alt}
                                        loading="lazy"
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                ))}
            </article>
        </div>
    );
};

export default UserGuidePage;
