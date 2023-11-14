'use client';
import { storyblokInit, apiPlugin } from '@storyblok/react/rsc';
import AccordionTile from './tile-components/accordion-tile/AccordionTile';
import ApplicationForm from './vacancy-components/application-form/ApplicationForm';
import Button from './elements/button/Button';
import CarouselContainer from './container-components/carousel-container/CarouselContainer';
import CategoryTile from './tile-components/category-tile/CategoryTile';
import Checkbox from './elements/checkbox/Checkbox';
import ColumnContainer from './container-components/column-container/ColumnContainer';
import Email from './elements/validators/Email';
import EmailTile from './tile-components/email-tile/EmailTile';
import Footer from './navigation-components/footer/Footer';
import FormBlock from './stand-alone-components/form/Form';
import FormInput from './elements/text-field/TextField';
import FormTile from './tile-components/form-tile/FormTile';
import GeneralTile from './tile-components/general-tile/GeneralTile';
import GridContainer from './container-components/grid-container/GridContainer';
import Header from './navigation-components/header/Header';
import Hero from './stand-alone-components/hero/Hero';
import ImageTile from './tile-components/image-tile/ImageTile';
import JobAlertForm from './vacancy-components/job-alert-form/JobAlertForm';
import ListContainer from './container-components/list-container/ListContainer';
import MaxLength from './elements/validators/MaxLength';
import MenuItem from './navigation-components/header/children/MenuItem';
import MinLength from './elements/validators/MinLength';
import Numeric from './elements/validators/Numeric';
import PageLayout from './templates/page/PageLayout';
import Paragraph from './stand-alone-components/paragraph/Paragraph';
import ParagraphTile from './tile-components/paragraph-tile/ParagraphTile';
import RadioInputField from './elements/radio-input-field/RadioInputField';
import RadioOption from './elements/radio-option/RadioOption';
import RecruiterBlock from './vacancy-components/recruiter-block/RecruiterBlock';
import Required from './elements/validators/Required';
import SearchBlockComponent from './stand-alone-components/search-block/SearchBlock.component';
import SelectField from './elements/select-field/SelectField';
import SelectOption from './elements/select-option/SelectOption';
import siteConfig from './siteConfig/siteConfig';
import SocialShareTile from './tile-components/social-share-tile/SocialShareTile';
import TabContainer from './container-components/tab-container/TabContainer';
import TeamTile from './tile-components/team-tile/TeamTile';
import TestimonialTile from './tile-components/testimonial-tile/TestimonialTile';
import VacancyHero from './vacancy-components/vacancy-hero/VacancyHero';
import VacancyListerBlock from './vacancy-components/vacancy-lister-block/VacancyLister';
import vacancyParagraph from './vacancy-components/vacancy-paragraph/VacancyParagraph';
import VacancyTile from './tile-components/vacancy-tile/VacancyTile';
import VideoBlock from './stand-alone-components/video/VideoBlock';
import { Switch } from './elements/switch/Switch';
import EmailBlock from './tile-components/email-tile/EmailTile';
import SocialShare from './tile-components/social-share-tile/SocialShareTile';
import RelatedVacancyBlock from './vacancy-components/related-vacancy-block/RelatedVacancyBlock';
import FormTextarea from './elements/text-area/TextField';
import FileInput from './elements/file-field/FileInput';
import EmptyTile from './tile-components/empty-tile/EmptyTile';
import Tel from './elements/validators/Tel';
import Spacer from './elements/spacer/Spacer';
import Article from './templates/article/Article';
import ArticleContainer from './container-components/article-container/ArticleContainer';
import HomePageHero from './stand-alone-components/home-page-hero/HomePageHero';
import Tag from './elements/Tag/Tag';
import ShowcaseTile from './tile-components/showcase-tile/ShowcaseTile';

const components = {
  siteConfig: siteConfig,

  // Templates
  page: PageLayout,
  article: Article,

  // Vacancy
  vacancyListerBlock: VacancyListerBlock,
  vacancyHero: VacancyHero,
  vacancyParagraph: vacancyParagraph,
  recruiterBlock: RecruiterBlock,
  applicationForm: ApplicationForm,
  jobAlertForm: JobAlertForm,
  relatedVacancyBlock: RelatedVacancyBlock,

  // Elements
  menuItem: MenuItem,
  formInput: FormInput,
  button: Button,
  formSelect: SelectField,
  selectOption: SelectOption,
  formCheckbox: Checkbox,
  formRadioInput: RadioInputField,
  radioOption: RadioOption,
  switch: Switch,
  formTextarea: FormTextarea,
  formFileInput: FileInput,
  spacer: Spacer,

  // Navigation
  header: Header,
  footer: Footer,
  // Containers
  gridContainer: GridContainer,
  columnContainer: ColumnContainer,
  tabContainer: TabContainer,
  carouselContainer: CarouselContainer,
  listContainer: ListContainer,
  articleCarousel: ArticleContainer,

  // Standalone
  hero: Hero,
  homePageHero: HomePageHero,
  form: FormBlock,
  paragraph: Paragraph,
  searchBlock: SearchBlockComponent,
  videoBlock: VideoBlock,
  shareByMailBlock: EmailBlock,
  shareBySocialsBlock: SocialShare,
  tag: Tag,

  // Tiles
  accordionTile: AccordionTile,
  imageTile: ImageTile,
  paragraphTile: ParagraphTile,
  formTile: FormTile,
  testimonialTile: TestimonialTile,
  generalTile: GeneralTile,
  categoryTile: CategoryTile,
  vacancyTile: VacancyTile,
  teamTile: TeamTile,
  emailTile: EmailTile,
  socialShareTile: SocialShareTile,
  emptyTile: EmptyTile,
  showcaseTile: ShowcaseTile,

  // Validators
  email: Email,
  maximumLength: MaxLength,
  minimumLength: MinLength,
  required: Required,
  numeric: Numeric,
  tel: Tel,
};

storyblokInit({
  accessToken: 'tLYGPiLYLbBNhXpBCdPQcAtt',
  use: [apiPlugin],
  apiOptions: {
    region: 'eu',
    cache: {
      clear: 'auto',
      type: 'memory',
    },
  },
  components,
});

export default function StoryblokProvider({ children }) {
  return children;
}
