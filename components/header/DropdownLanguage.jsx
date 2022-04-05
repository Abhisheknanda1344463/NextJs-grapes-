import React from "react";
import Dropdown from "./Dropdown";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { changeLocale } from "../../store/locale";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

function DropdownLanguage(props) {
  const locale = useSelector((state) => state.locale);
  if (!props.languages) {
    return null;
  }
  const router = useRouter();
  // const { pathname, asPath, query } = router;
  const { languages } = props;

  const handleRoute = (locale) => {
    ///  changeLocale(locale);
    router.push(
      router.asPath != "/" ? router.asPath : "",
      router.asPath != "/" ? router.asPath : "",
      {
        locale: locale,
      }
    );
  };

  const title = (
    <React.Fragment>
      <FormattedMessage id="topbar.language" defaultMessage="Armenian" />
    </React.Fragment>
  );

  return (
    <Dropdown
      withIcons
      for={"language"}
      title={title}
      locale={locale}
      items={languages}
      onClick={(item) => handleRoute(item.code)}
    />
  );
}

const mapStateToProps = ({ locale: { code, list, defaultLocale } }) => ({
  languages: list,
  code,
});

const mapDispatchToProps = {
  changeLocale,
};

export default connect(mapStateToProps, mapDispatchToProps)(DropdownLanguage);
