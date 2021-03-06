import React, { useState , useRef} from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import { StaticQuery, graphql } from "gatsby"
import { HelmetDatoCms } from 'gatsby-source-datocms'
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from '../styles/global';
import { theme } from '../styles/theme';
import '../styles/index.sass'
import Burger from './Burger'
import Menu from './Menu'
import { useOnClickOutside } from './hooks';
require('purecss')
const TemplateWrapper = ({ children }) => {
  const [open, setOpen] = useState(false);
  const node = useRef(); 
useOnClickOutside(node, () => setOpen(false));
  const menuId = "main-menu";

  return (
    <ThemeProvider theme={theme}>
    <GlobalStyles />
    <StaticQuery query={graphql`
    query LayoutQuery
    {
      datoCmsSite {
        globalSeo {
          siteName
        }
        faviconMetaTags {
          ...GatsbyDatoCmsFaviconMetaTags
        }
      }
      datoCmsHome {
        seoMetaTags {
          ...GatsbyDatoCmsSeoMetaTags
        }
        introTextNode {
          childMarkdownRemark {
            html
          }
        }
        copyright
      }
      allDatoCmsSocialProfile(sort: { fields: [position], order: ASC }) {
        edges {
          node {
            profileType
            url
          }
        }
      }
    }
  `}
      render={data => (
        <div className="container">
          <HelmetDatoCms
            favicon={data.datoCmsSite.faviconMetaTags}
            seo={data.datoCmsHome.seoMetaTags}
          />
          <div className="container__sidebar">
            <div className="sidebar">
              <h1 className="sidebar__title">
                <Link to="/">{data.datoCmsSite.globalSeo.siteName}</Link>
              </h1>
              {/* <div
                className="sidebar__intro"
                dangerouslySetInnerHTML={{
                  __html: data.datoCmsHome.introTextNode.childMarkdownRemark.html,
                }}
              /> */}
              <ul className="sidebar__menu">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
              <p className="sidebar__social">
                {data.allDatoCmsSocialProfile.edges.map(({ node: profile }) => (
                  <a
                    key={profile.profileType}
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`social social--${profile.profileType.toLowerCase()}`}
                  > </a>
                ))}
              </p>
              <div className="sidebar__copyright">&copy; {new Date().getFullYear()} Tomoya Kuroda</div>
            </div>
          </div>
          <div className="container__body">
            <div className="container__mobile-header">
              <div className="mobile-header">
                <div ref={node}>
                <Burger open={open} setOpen={setOpen} aria-controls={menuId} />
                {
                  open && (
                    <Menu open={open} setOpen={setOpen} id={menuId} />
                  )
                }

            </div>
                <div className="mobile-header__logo">
                  <Link to="/">{data.datoCmsSite.globalSeo.siteName}</Link>
                </div>
              </div>
            </div>
            {children}
          </div>
        </div>
      )}
    />
    </ThemeProvider>
  )
}

TemplateWrapper.propTypes = {
  children: PropTypes.object,
}

export default TemplateWrapper
