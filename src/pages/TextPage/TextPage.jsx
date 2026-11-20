// Framework and third-party non-ui
import React from 'react';

// Hooks, context, and constants
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContextSimple';

// Third-party components (buttons, icons, etc.)
import { Button, Icon } from '@trussworks/react-uswds';

import './TextPage.scss';

// Text may contain links written as [label](url)
const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

const RichText = ({ text }) => {
    const parts = [];
    let last = 0;
    for (const match of text.matchAll(LINK)) {
        parts.push(text.slice(last, match.index));
        const [, label, url] = match;
        // Paths inside the app (e.g. the license file) follow the site's base path
        const href = url.startsWith('/') ? `${import.meta.env.BASE_URL}${url.slice(1)}` : url;
        parts.push(
            <a key={match.index} href={href} target="_blank" rel="noopener noreferrer">
                {label}
            </a>
        );
        last = match.index + match[0].length;
    }
    parts.push(text.slice(last));
    return <>{parts}</>;
};

/**
 * A page of text opened from the header: the user guide or the credits and sources.
 * The text is in the translations under `textKey`:
 *   Title, Intro (a string or a list of paragraphs), Contents (heading of the table of contents,
 *   shown only if set) and Sections. Each section has an Id, a Title, Blocks (a paragraph string
 *   or a list { List: [{ Term, Text }] }) and optional Images ([{ File, Alt }] in
 *   public/images/user-guide/, made with scripts/guide-screenshots.mjs).
 * Paragraphs and list text may contain links written as [label](url).
 */
const TextPage = ({ textKey }) => {
    const { t, i18n } = useTranslation();
    const { closeTextPage } = useAppContext();
    const sections = t(`${textKey}.Sections`, { returnObjects: true });
    const intro = t(`${textKey}.Intro`, { returnObjects: true });
    const hasContents = i18n.exists(`${textKey}.Contents`);

    const renderBlock = (block, idx) =>
        typeof block === 'string' ? (
            <p key={idx}>
                <RichText text={block} />
            </p>
        ) : (
            <ul key={idx}>
                {block.List.map(({ Term, Text }) => (
                    <li key={Term ?? Text}>
                        {Term && <strong>{Term}</strong>}
                        {Term && ' – '}
                        <RichText text={Text} />
                    </li>
                ))}
            </ul>
        );

    return (
        <div className="textPage">
            <Button className="textPage__back usa-button--ghost-light" onClick={closeTextPage}>
                <Icon.ArrowBack aria-hidden size={2} />
                {t('App.BackButtonText')}
            </Button>

            <article className="textPage__content">
                <h1 className="textPage__title">{t(`${textKey}.Title`)}</h1>
                {(Array.isArray(intro) ? intro : [intro]).map((paragraph, idx) => (
                    <p key={idx} className="textPage__intro">
                        <RichText text={paragraph} />
                    </p>
                ))}

                {hasContents && (
                    <nav className="textPage__toc" aria-label={t(`${textKey}.Contents`)}>
                        <h2>{t(`${textKey}.Contents`)}</h2>
                        <ol>
                            {sections.map((section) => (
                                <li key={section.Id}>
                                    <a
                                        href={`#section-${section.Id}`}
                                        onClick={(event) => {
                                            // Scroll without adding the section to the address
                                            event.preventDefault();
                                            document
                                                .getElementById(`section-${section.Id}`)
                                                ?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                    >
                                        {section.Title}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </nav>
                )}

                {sections.map((section) => (
                    <section key={section.Id} id={`section-${section.Id}`} className="textPage__section">
                        <h2>{section.Title}</h2>
                        {section.Blocks.map(renderBlock)}
                        {section.Images && (
                            <div
                                className={`textPage__images ${section.Images.length > 1 ? 'textPage__images--pair' : ''}`}
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

export default TextPage;
