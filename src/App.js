import Gallery from './components/Gallery';
// import Profile from './components/Profile';
import TodoList from './components/TodoList';
import PackingList from './components/PackingList';
import DrinkList from './components/DrinkList';
import PeopleList from './components/PeopleList';
import Toolbar from './components/Toolbar';
import Sculptures from './components/Sculptures';
import StateSamples from './components/StateSamples';
import DragBox from './components/DragBox';
import ArraySamples from './components/ArraySamples';
import TravelPlan, { TravelPlanWithImmer } from './components/TravelPlan';
import MailClient from './components/MailClient';
import Accordion from './components/Accordion';
import TaskSample, { TaskProviderSample, TaskReducerAndContextSample, TaskReducerSample } from './components/TaskSample';
import HeadingContextSample, { ProfileContextSample } from './components/HeadingContextSample';
import RefSamples from './components/RefSamples';
import EffectSamples from './components/EffectSamples';
import EffectEventSamples from './components/EffectEventSamples';

function App() {
  return (
    <div className="container">
      <EffectEventSamples />
      <hr />
      <EffectSamples />
      <hr />
      <RefSamples />
      <hr />
      <ProfileContextSample />
      <hr />
      <HeadingContextSample />
      <hr />
      <TaskProviderSample />
      <hr />
      <TaskReducerAndContextSample />
      <hr />
      <TaskReducerSample />
      <hr />
      <TaskSample />
      <hr />
      <Accordion />
      <hr />
      <MailClient />
      <hr />
      <TravelPlanWithImmer />
      <hr />
      <TravelPlan />
      <hr />
      <StateSamples />
      <hr />
      <ArraySamples />
      <hr />
      <DragBox />
      <hr />
      <Sculptures />
      <hr />
      <Toolbar onPlayMovie={() => alert('Playing!')} onUploadImage={() => alert('Uploading!')} />
      <hr />
      <PeopleList />
      <hr />
      <DrinkList />
      <hr />
      <PackingList />
      <hr />
      <h1>Amazing scientists</h1>
      <hr/>
      <h2>Gallery with multiple 'Profile's</h2>
      <Gallery />
      {/* <hr/>
      <h2>Single Profile</h2>
      <Profile /> */}
      <hr/>
      <TodoList />
    </div>
  );
}

export default App;
