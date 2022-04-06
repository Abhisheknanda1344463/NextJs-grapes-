import React, {useState} from "react";
import Dropdown from "./Dropdown";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { changeLocale } from "../../store/locale";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

function DropdownLanguage(props) {
  const locale = useSelector((state) => state.locale);
  const router = useRouter();
  const [newLocal, setNewLocal] = useState(router.locale === 'catchAll' ? locale.code : router.locale)

  if (!props.languages) {
    return null;
  }
  // const { pathname, asPath, query } = router;
  const { languages } = props;

  const handleRoute = (locale) => {
    ///  changeLocale(locale);
    setNewLocal(() => locale)
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
      newLocal={newLocal}
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
