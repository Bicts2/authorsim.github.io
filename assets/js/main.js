import React from 'react'
import {render} from 'react-dom'
import Tooltip from 'react-tooltip'
require('./bootstrap.min.js')
import { save, startWriting, prettify, delSave,
          setResearchRequirements, researchRequirementsMet } from './game.js'
import { chooseSkill, startStaffWriting, staffGraduate,
          buyMonkey, hireStaff, startResearching } from './staff.js'
import upgrade from './upgrades.js'
import achieve from './achievements.js'
import tutorial from './tutorials.js'

let AuthorSim = React.createClass({
  render: () => {
    return (
      <div className="container">
        <Tooltip />
        <Header />
        <GameMenu />
        <GameField />

        <ConfirmWindow />
        <AchievementWindow />
        <TutorialWindow />
      </div>
    )
  }
})

let Header = React.createClass({
  render: () => {
    return (
      <div className="row text-center">
      	<h1>Author Simulator</h1>
        <p>version 0.7.1</p>
        <p>This is a PROTOTYPE. Expect a full wipe at 1.0.</p>
      </div>
    )
  }
})

let GameMenu = React.createClass({
  render: () => {
    return (
      <ul className="nav nav-tabs" role="tablist">
        <li role="presentation" className="active">
          <a href="#home" aria-controls="home" role="tab" data-toggle="tab">
          <span id="upgradeAvailable" className="upgrade glyphicon glyphicon-circle-arrow-up">
          </span>
          <span> Units</span>
          </a>
        </li>
        <li role="presentation">
          <a href="#staff" aria-controls="staff" role="tab" data-toggle="tab">
            Staff
          </a>
        </li>
        <li role="presentation">
          <a href="#achievements" aria-controls="achievements" role="tab" data-toggle="tab">Achievements</a>
        </li>
        <li role="presentation" className="dropdown">
          <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
            More <span className="caret"></span>
          </a>
          <ul className="dropdown-menu">
            <li>
              <a href="#changelog" aria-controls="changelog" role="tab" data-toggle="tab">Changelog</a>
            </li>
            <li>
              <a href="#options" aria-controls="options" role="tab" data-toggle="tab">Options</a>
            </li>
          </ul>
        </li>
        <li role="presentation" className="navbar-right">
          <div id="error" className="menuAlert">
            <span className="glyphicon glyphicon-exclamation-sign menuAlertGlyphicon"></span>
            <span id="errorTitle" className="menuAlertTitle"></span>
            <span id="errorDesc"></span>
          </div>
        </li>
      </ul>
    )
  }
})

let GameField = React.createClass({
  getInitialState: function() {
    return {
      save: save,
    }
  },
  updateSave: function() {
    this.setState({
      save: save
    })
  },
  componentDidMount: function() {
    setInterval(this.updateSave, 100)
  },
  render: function () {
    return (
      <div className="tab-content">
        <UnitPanel save={this.state.save}/>
        <StaffPanel save={this.state.save} />
        <AchievementPanel />
        <div role="tabpanel" className="tab-pane fade" id="statistics">

        </div>
        <OptionsPanel />
        <ChangelogPanel />
      </div>
    )
  }
})

let UnitPanel = React.createClass({
  write: function(unit) {
    startWriting(unit)
  },
  render: function() {
    return (
      <div role="tabpanel" className="tab-pane active fade in" id="home">
        <div className="row">
          <div className="tab-content col-sm-3">
            <ul className="nav nav-pills nav-stacked">
              <UnitMenuItem
                unit="Encyclopedias"
                total={this.props.save.encyclopedias.total}
              />
              <UnitMenuItem
                unit="Books"
                total={this.props.save.books.total}
              />
              <UnitMenuItem
                unit="Chapters"
                total={this.props.save.chapters.total}
              />
              <UnitMenuItem
                unit="Pages"
                total={this.props.save.pages.total}
              />
              <UnitMenuItem
                unit="Sentences"
                total={this.props.save.sentences.total}
              />
              <UnitMenuItem
                unit="Words"
                total={this.props.save.words.total}
              />
              <UnitMenuItem
                unit="Letters"
                total={this.props.save.letters.total}
              />
            </ul>
          </div>
          <div className="tab-content col-sm-9">
            <UnitDetailsPanel
              unit={this.props.save.letters}
              write={this.write.bind(null, this.props.save.letters.unit)}
            />
            <UnitDetailsPanel
              unit={this.props.save.words}
              write={this.write.bind(null, this.props.save.words.unit)}
            />
            <UnitDetailsPanel
              unit={this.props.save.sentences}
              write={this.write.bind(null, this.props.save.sentences.unit)}
            />
            <UnitDetailsPanel
              unit={this.props.save.pages}
              write={this.write.bind(null, this.props.save.pages.unit)}
            />
            <UnitDetailsPanel
              unit={this.props.save.chapters}
              write={this.write.bind(null, this.props.save.chapters.unit)}
            />
            <UnitDetailsPanel
              unit={this.props.save.books}
              write={this.write.bind(null, this.props.save.books.unit)}
            />
            <EncyclopediaPanel
              unit={this.props.save.encyclopedias}
            />
            <UniquePanel
              save={this.props.save}
            />
          </div>
        </div>
      </div>
    )
  }
})

let UnitMenuItem = React.createClass({
  render: function() {
    return (
      <li id={this.props.unit + "Menu"} role="presentation">
        <a href={'#' + this.props.unit.toLowerCase()} role="tab" data-toggle="tab" onClick={this.props.update}>
          <div className="row">
            <div className="col-sm-2">
              <span id={this.props.unit + 'UpgradeAvailable'} className="upgrade glyphicon glyphicon-circle-arrow-up">
              </span>
            </div>
            <div className="col-sm-4">{this.props.unit}</div>
            <div className="col-sm-5 text-right">{prettify(this.props.total)}</div>
          </div>
        </a>
      </li>
    )
  }
})

let UnitDetailsPanel = React.createClass({
  render: function() {
    return (
      <div id={this.props.unit.unit} role="tabpanel" className="tab-pane fade">
        <div className="row">
          <div className="col-sm-7">
            <p>You have {prettify(this.props.unit.total)} {this.props.unit.unit}.</p>
            <p>You are generating {prettify(this.props.unit.generating, 2)} total {this.props.unit.unit} per second.</p>
            <p>You are using {prettify(this.props.unit.using, 2)} {this.props.unit.unit} per second.</p>
            {this.props.unit.unit !== 'letters' ?
              <p>Writing {this.props.unit.unit} costs {prettify(this.props.unit.cost, 1)} of the previous unit.</p> :
              null
            }
          </div>
          {this.props.unit.unit === 'letters' ?
            <UnitPanelLettersUpgrade /> : null
          }
          {this.props.unit.unit === 'words' ?
            <UnitPanelWordsUpgrade /> : null
          }
          {this.props.unit.unit === 'sentences' ?
            <UnitPanelSentencesUpgrade /> : null
          }
          {this.props.unit.unit === 'pages' ?
            <UnitPanelPagesUpgrade /> : null
          }
          {this.props.unit.unit === 'chapters' ?
            <UnitPanelChaptersUpgrade /> : null
          }
          {this.props.unit.unit === 'books' ?
            <UnitPanelBooksUpgrade /> : null
          }
        </div>
        <div id={this.props.unit.unit + "ManualSection"} className="row">
        <hr />
          <div className="col-sm-12">
            <p>Writing {this.props.unit.unit} by hand takes {prettify(this.props.unit.timer, 2)} seconds.
            </p>
          </div>
          <div className="col-sm-8 col-sm-offset-2">
          <div className="progress">
            <div className="progress-bar progress-bar-info progress-bar-striped active"
                id={"write" + this.props.unit.unit}
                role="progressbar"
                aria-valuenow="0"
                aria-valuemin="0"
                aria-valuemax="100">
            </div>
          </div>
            <button className="btn btn-lg btn-info center-block" onClick={this.props.write}>
              Write {this.props.unit.unit}
            </button>
          </div>
        </div>
      </div>
    )
  }
})

let EncyclopediaPanel = React.createClass({
  research: function() {
    setResearchRequirements()
  },
  check: function() {
    researchRequirementsMet()
  },
  render: function() {
    return (
      <div id={this.props.unit.unit} role="tabpanel" className="tab-pane fade">
        <div className="row">
          <div className="col-sm-12">
            <p>You have {prettify(this.props.unit.total)} {this.props.unit.unit}.</p>
            <h3>To write your next encyclopedia, you need:</h3>
            <h4>{prettify(this.props.unit.requirements.first.num)} {this.props.unit.requirements.first.unit}</h4>
            <h4>{prettify(this.props.unit.requirements.second.num)} {this.props.unit.requirements.second.unit}</h4>
            <h4>{prettify(this.props.unit.requirements.third.num)} {this.props.unit.requirements.third.unit}</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-8 col-sm-offset-2">
            <h1 className="text-center">Learning Opportunities</h1>

              <button
                className="btn btn-success btn-lg"
                onClick={this.research}
              >
                <p>Set research requirements</p>
              </button>
              <button
                className="btn btn-success btn-lg"
                onClick={this.check}
              >
                <p>Check research requirements</p>
              </button>

              <EncyclopediaPanelUpgradeItem
                upgradeName="Monkey Mutation"
                desc="Monkeys fully mutate. Have a chance of discovering unique letters when writing."
                func={upgrade.monkeyMutation}
                cost="1 Encyclopedias"
              />
              <EncyclopediaPanelUpgradeItem
                upgradeName="Burden Of Knowledge"
                desc="Every unit costs 50% more. Triples chance of discovering unique letters."
                func={upgrade.burdenOfKnowledge}
                cost="2 Encyclopedias"
              />
          </div>
        </div>
      </div>
    )
  }
})

let UniquePanel = React.createClass({
  render: function() {
    return (
      <div id="uniquePanel" role="tabpanel" className="tab-pane fade">
        <div className="row">
          <div className="col-sm-12">
            <p>{this.props.save.letters.uniqueTotal}
            {this.props.save.letters.unit}</p>
            <p>{this.props.save.words.uniqueTotal}
            {this.props.save.words.unit}</p>
            <p>{this.props.save.sentences.uniqueTotal}
            {this.props.save.sentences.unit}</p>
            <p>{this.props.save.pages.uniqueTotal}
            {this.props.save.pages.unit}</p>
            <p>{this.props.save.chapters.uniqueTotal}
            {this.props.save.chapters.unit}</p>
            <p>{this.props.save.books.uniqueTotal}
            {this.props.save.books.unit}</p>
          </div>
        </div>
      </div>
    )
  }
})

let EncyclopediaPanelUpgradeItem = React.createClass({
  render: function() {
    return (
      <button
        id={this.props.upgradeName.replace(/\s+/g, '')}
        className="btn btn-success btn-lg upgrade"
        onClick={this.props.func}
        data-tip={this.props.desc}
      >
        <p>{this.props.upgradeName}</p>
        <small>Cost: {this.props.cost}</small>
      </button>
    )
  }
})

let UnitPanelUpgradeItem = React.createClass({
  render: function() {
    return (
      <button
        id={this.props.upgradeName.replace(/\s+/g, '')}
        className="btn btn-success btn-sm upgrade"
        onClick={this.props.func}
        data-tip={this.props.desc}
      >
        <p>{this.props.upgradeName}</p>
        <small>Cost: {this.props.cost}</small>
      </button>
    )
  }
})

let UnitPanelLettersUpgrade = React.createClass({
  render: function() {
    return (
      <div className="col-sm-5">
        <UnitPanelUpgradeItem
          upgradeName="Write Words"
          desc="Allows you to write words manually."
          func={upgrade.writeWords}
          cost="238 Letters"
        />
        <UnitPanelUpgradeItem
          upgradeName="Faster Letters"
          desc="Write letters 50% faster."
          func={upgrade.fasterLetters}
          cost="1,225 Letters"
        />
        <UnitPanelUpgradeItem
          upgradeName="Efficient Monkeys"
          desc="Monkeys write 10% more letters."
          func={upgrade.efficientMonkeys}
          cost="525 Letters"
        />
        <UnitPanelUpgradeItem
          upgradeName="Monkey Intelligence I"
          desc="Monkeys write 20% more letters."
          func={upgrade.monkeyIntelligenceI}
          cost="2,450 Letters"
        />
        <UnitPanelUpgradeItem
          upgradeName="Smarter Letters"
          desc="Write 10% more letters."
          func={upgrade.smarterLetters}
          cost="3,500 Letters"
        />
        <UnitPanelUpgradeItem
          upgradeName="Monkey Intelligence II"
          desc="Monkeys write 25% more letters."
          func={upgrade.monkeyIntelligenceII}
          cost="5,425 Letters"
        />
        <UnitPanelUpgradeItem
          upgradeName="Efficient Words"
          desc="Words are 10% cheaper."
          func={upgrade.efficientWords}
          cost="10,150 Letters"
        />
        <UnitPanelUpgradeItem
          upgradeName="Monkey Intelligence Breakthrough"
          desc="Monkeys write 100% more letters."
          func={upgrade.monkeyIntelligenceBreakthrough}
          cost="15,400 Letters"
        />
        <UnitPanelUpgradeItem
          upgradeName="Too Many Letters"
          desc="Write 200% more words."
          func={upgrade.tooManyLetters}
          cost="35,000 Letters"
        />
        <UnitPanelUpgradeItem
          upgradeName="Monkey Glasses"
          desc="Monkeys tap out 150% more letters."
          func={upgrade.monkeyGlasses}
          cost="23,800 Letters"
        />
        <UnitPanelUpgradeItem
          upgradeName="Another Finger"
          desc="What the? Monkeys write 20% more letters."
          func={upgrade.anotherFinger}
          cost="61,250 Letters"
        />
        <UnitPanelUpgradeItem
          upgradeName="Third Arm"
          desc="Disturbing and efficient. Monkeys write 33% more letters."
          func={upgrade.thirdArm}
          cost="168,000 Letters"
        />
        <UnitPanelUpgradeItem
          upgradeName="Strange Language"
          desc="Sounds like a kind of moaning. No matter, monkeys write 50% more letters."
          func={upgrade.strangeLanguage}
          cost="350,000 Letters"
        />
      </div>
    )
  }
})

let UnitPanelWordsUpgrade = React.createClass({
  render: function() {
    return (
      <div className="col-sm-5">
        <UnitPanelUpgradeItem
          upgradeName="Write Sentences"
          desc="Allows you to write sentences manually."
          func={upgrade.writeSentences}
          cost="60 Words"
        />
        <UnitPanelUpgradeItem
          upgradeName="Faster Words"
          desc="Write words 30% faster."
          func={upgrade.fasterWords}
          cost="50 Words"
        />
        <UnitPanelUpgradeItem
          upgradeName="Word Whiz"
          desc="Write 15% more words."
          func={upgrade.wordWhiz}
          cost="200 Words"
        />
        <UnitPanelUpgradeItem
          upgradeName="Getting The Hang Of It"
          desc="Write words 50% faster."
          func={upgrade.gettingTheHangOfIt}
          cost="600 Words"
        />
        <UnitPanelUpgradeItem
          upgradeName="Word Of Wisdom"
          desc="Write 50% more words."
          func={upgrade.wordOfWisdom}
          cost="1,100 Words"
        />
        <UnitPanelUpgradeItem
          upgradeName="Sticks And Stones"
          desc="Words hurt, I mean cost 20% more but generate 50% more."
          func={upgrade.sticksAndStones}
          cost="2,200 Words"
        />
        <UnitPanelUpgradeItem
          upgradeName="Dime A Dozen"
          desc="Write 10% more words."
          func={upgrade.dimeADozen}
          cost="11,000 Words"
        />
        <UnitPanelUpgradeItem
          upgradeName="Choice Words"
          desc="Write words 35% faster."
          func={upgrade.choiceWords}
          cost="16,100 Words"
        />
        <UnitPanelUpgradeItem
          upgradeName="Gobbeldy Gook"
          desc="Write 100% more words."
          func={upgrade.gobbeldyGook}
          cost="34,000 Words"
        />
      </div>
    )
  }
})

let UnitPanelSentencesUpgrade = React.createClass({
  render: function() {
    return (
      <div className="col-sm-5">
      <UnitPanelUpgradeItem
        upgradeName="Write Pages"
        desc="Allows you to write pages manually."
        func={upgrade.writePages}
        cost="100 Sentences"
      />
        <UnitPanelUpgradeItem
          upgradeName="Faster Sentences"
          desc="Write sentences 25% faster."
          func={upgrade.fasterSentences}
          cost="50 Sentences"
        />
        <UnitPanelUpgradeItem
          upgradeName="Higher Learning"
          desc="Write 15% more sentences."
          func={upgrade.higherLearning}
          cost="210 Sentences"
        />
        <UnitPanelUpgradeItem
          upgradeName="Longer Sentences"
          desc="Sentences cost 10% more but write 50% more."
          func={upgrade.longerSentences}
          cost="300 Sentences"
        />
        <UnitPanelUpgradeItem
          upgradeName="Even Faster Sentences"
          desc="Write sentences 50% faster."
          func={upgrade.evenFasterSentences}
          cost="170 Sentences"
        />
        <UnitPanelUpgradeItem
          upgradeName="Letter Tradeoff"
          desc="Generate 10% fewer letters and 30% more sentences."
          func={upgrade.letterTradeoff}
          cost="250 Sentences"
        />
        <UnitPanelUpgradeItem
          upgradeName="Common Knowledge"
          desc="Write pages 50% faster."
          func={upgrade.commonKnowledge}
          cost="420 Sentences"
        />
        <UnitPanelUpgradeItem
          upgradeName="Repeating Patterns"
          desc="Write 35% more sentences 25% faster."
          func={upgrade.repeatingPatterns}
          cost="1,000 Sentences"
        />
        <UnitPanelUpgradeItem
          upgradeName="Bigger Font Size"
          desc="Hardly cheating. Write sentences 30% faster."
          func={upgrade.biggerFontSize}
          cost="2,700 Sentences"
        />
        <UnitPanelUpgradeItem
          upgradeName="Spinning Sentences"
          desc="Has anyone really been far even as decided to use even go want to do look more like? Also, write sentences twice as fast."
          func={upgrade.spinningSentences}
          cost="3,200 Sentences"
        />
        <UnitPanelUpgradeItem
          upgradeName="Letter Spacing"
          desc="Squeeze them a little further...perfect. Write 60% more sentences."
          func={upgrade.letterSpacing}
          cost="3,800 Sentences"
        />
      </div>
    )
  }
})

let UnitPanelPagesUpgrade = React.createClass({
  render: function() {
    return (
      <div className="col-sm-5">
        <UnitPanelUpgradeItem
          upgradeName="Write Chapters"
          desc="Allows you to write chapters manually."
          func={upgrade.writeChapters}
          cost="900 Pages"
        />
        <UnitPanelUpgradeItem
          upgradeName="Jump Off The Page"
          desc="Write 10% more pages."
          func={upgrade.jumpOffThePage}
          cost="135 Pages"
        />
        <UnitPanelUpgradeItem
          upgradeName="Faster Pages"
          desc="Write pages 20% faster."
          func={upgrade.fasterPages}
          cost="225 Pages"
        />
        <UnitPanelUpgradeItem
          upgradeName="Smaller Margins"
          desc="Write 25% more pages for 10% more sentences."
          func={upgrade.smallerMargins}
          cost="450 Pages"
        />
        <UnitPanelUpgradeItem
          upgradeName="Trickle Effect"
          desc="Write 20% more pages, 10% more sentences, 5% more words, and 2.5% more letters."
          func={upgrade.trickleEffect}
          cost="1,050 Pages"
        />
        <UnitPanelUpgradeItem
          upgradeName="Triple Spacing"
          desc="No one will notice. Write pages 33% faster."
          func={upgrade.tripleSpacing}
          cost="2,400 Pages"
        />
        <UnitPanelUpgradeItem
          upgradeName="Huge Margins"
          desc="Pushing 1.1 inches, eh? Write 25% more pages."
          func={upgrade.hugeMargins}
          cost="3,000 Pages"
        />
        <UnitPanelUpgradeItem
          upgradeName="Paragraph Spacing"
          desc="More space between paragraphs. Write pages 30% faster."
          func={upgrade.paragraphSpacing}
          cost="3,600 Pages"
        />
      </div>
    )
  }
})

let UnitPanelChaptersUpgrade = React.createClass({
  render: function() {
    return (
      <div className="col-sm-5">
        <UnitPanelUpgradeItem
          upgradeName="Write Books"
          desc="Allows you to write books manually."
          func={upgrade.writeBooks}
          cost="600 Chapters"
        />
        <UnitPanelUpgradeItem
          upgradeName="Faster Chapters"
          desc="Write chapters 30% faster."
          func={upgrade.fasterChapters}
          cost="6 Chapters"
        />
        <UnitPanelUpgradeItem
          upgradeName="Share The Love"
          desc="Write all units 20% faster."
          func={upgrade.shareTheLove}
          cost="44 Chapters"
        />
        <UnitPanelUpgradeItem
          upgradeName="Chapter A Day"
          desc="Keeps the monkeys at bay. Write pages 60% faster."
          func={upgrade.chapterADay}
          cost="66 Chapters"
        />
        <UnitPanelUpgradeItem
          upgradeName="Extra Space"
          desc="End a chapter with a couple sentences and a TON of blank space! Write 30% more chapters."
          func={upgrade.extraSpace}
          cost="132 Chapters"
        />
      </div>
    )
  }
})

let UnitPanelBooksUpgrade = React.createClass({
  render: function() {
    return (
      <div className="col-sm-5">
        <UnitPanelUpgradeItem
          upgradeName="Researcher"
          desc="Start the next phase of your journey..."
          func={upgrade.researcher}
          cost="3 Books"
        />
      </div>
    )
  }
})

let StaffPanel = React.createClass({
  hire: function(slot) {
    hireStaff(slot)
  },
  buyMonkey: function() {
    buyMonkey()
  },
  render: function() {
    return (
      <div role="tabpanel" className="tab-pane fade in" id="staff">
        <div className="row">
          <div className="col-sm-2 text-center">
            Letters: {prettify(this.props.save.letters.total)}
          </div>
          <div className="col-sm-2 text-center">
            Words: {prettify(this.props.save.words.total)}
          </div>
          <div className="col-sm-2 text-center">
            Sentences: {prettify(this.props.save.sentences.total)}
          </div>
          <div className="col-sm-2 text-center">
            Pages: {prettify(this.props.save.pages.total)}
          </div>
          <div className="col-sm-2 text-center">
            Chapters: {prettify(this.props.save.chapters.total)}
          </div>
          <div className="col-sm-2 text-center">
            Books: {prettify(this.props.save.books.total)}
          </div>
        </div>
        <div className="row">
          <div className="col-sm-3">
            <button className="btn btn-primary"
              onClick={this.buyMonkey}
              data-tip="Writes 1 letter every 4 seconds">
                Buy Monkey for {prettify(this.props.save.monkeys.cost)} Words
            </button>
          </div>
  				<div className="col-sm-3">
  					<h4 id="monkeys" data-tip="<img src='./images/monkey.png'>" data-html={true}>
              Monkeys : {this.props.save.monkeys.total}
            </h4>
  				</div>
        </div>
        <hr />
        <div className="row">
          {this.props.save.staff.s1.active ?
            <StaffSlot staff={this.props.save.staff.s1} slot='1' /> :
            <PurchaseStaffSlot hire={this.hire.bind(null, '1')} slot='1' />
          }
          {this.props.save.staff.s2.active ?
            <StaffSlot staff={this.props.save.staff.s2} slot='2' /> :
            <PurchaseStaffSlot hire={this.hire.bind(null, '2')} slot='2' />
          }
          {this.props.save.staff.s3.active ?
            <StaffSlot staff={this.props.save.staff.s3} slot='3' /> :
            <PurchaseStaffSlot hire={this.hire.bind(null, '3')} slot='3' />
          }
          {this.props.save.staff.s4.active ?
            <StaffSlot staff={this.props.save.staff.s4} slot='4' /> :
            <PurchaseStaffSlot hire={this.hire.bind(null, '4')} slot='4' />
          }
          {this.props.save.staff.s5.active ?
            <StaffSlot staff={this.props.save.staff.s5} slot='5' /> :
            <PurchaseStaffSlot hire={this.hire.bind(null, '5')} slot='5' />
          }
          {this.props.save.staff.s6.active ?
            <StaffSlot  staff={this.props.save.staff.s6} slot='6' /> :
            <PurchaseStaffSlot hire={this.hire.bind(null, '6')} slot='6' />
          }
          {this.props.save.staff.s7.active ?
            <StaffSlot staff={this.props.save.staff.s7} slot='7' /> :
            <PurchaseStaffSlot hire={this.hire.bind(null, '7')} slot='7' />
          }
          {this.props.save.staff.s8.active ?
            <StaffSlot staff={this.props.save.staff.s8} slot='8' /> :
            <PurchaseStaffSlot hire={this.hire.bind(null, '8')} slot='8' />
          }
          {this.props.save.staff.s9.active ?
            <StaffSlot staff={this.props.save.staff.s9} slot='9' /> :
            <PurchaseStaffSlot hire={this.hire.bind(null, '9')} slot='9' />
          }
        </div>
      </div>
    )
  }
})

let StaffSlot = React.createClass({
  getEducation: function() {
    let edu = ''
    switch (this.props.staff.prestige) {
      case 1:
        edu = 'Middle School'
        break
      case 2:
        edu = 'High School Dropout'
        break
      case 3:
        edu = 'Undergraduate'
        break
      case 4:
        edu = 'Graduate Student'
        break
      case 5:
        edu = 'PhD'
        break
    }
    return edu
  },
  startWriting: function(unit) {
    startStaffWriting(unit, this.props.slot)
  },
  startResearching: function() {
    startResearching(this.props.slot)
  },
  graduate: function() {
    staffGraduate(this.props.slot)
  },
  chooseSkill: function() {
    chooseSkill(this.props.slot)
  },
  componentDidMount: function() {
    for (let i = 1; i < 10; i++) {
      let staff = save['staff']['s' + i]
      if (staff['active'] && staff['writing'] !== 'none') {
        // Update button visuals
        $('#staff' + staff['writing'] + i)
          .removeClass('btn-primary')
          .addClass('active btn-success')
      }
  	}
  },
  render: function() {
    let expBar = {
      width: (this.props.staff.exp / this.props.staff.nextExp * 100) + '%'
    }

    let progressBar = {
      width: this.props.staff.progress + '%'
    }

    return (
      <div className="col-sm-4 staff-stat">
          <div className="col-sm-7">
            <h4>{this.props.staff.name}</h4>
          </div>
          <div className="col-sm-5">
            {this.props.staff.skillPoint > 0 ?
              <button id={'staffSkillPoint' + this.props.slot} onClick={this.chooseSkill} type="button" className="btn btn-success btn-md">
                Choose Skill
              </button> : null
            }
          </div>
          <div className="col-sm-12">
            <strong>Education:</strong> {this.getEducation()}
          </div>
          <div className="col-sm-6" data-tip="Higher number uses fewer resources">
            <strong>Efficiency:</strong> {prettify(this.props.staff.eff * 100) + '%'}
          </div>
          <div className="col-sm-6" data-tip="Higher number writes faster">
            <strong>Speed:</strong> {prettify(this.props.staff.speed * 100) + '%'}
          </div>
          <div className="col-sm-3">
            <strong>Level:</strong> {this.props.staff.level}
          </div>
          <div className="col-sm-9">
            {this.props.staff.level === 10 ?
              null :
              <div id={'staffExpBar' + this.props.slot} className="progress">
                <div className="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="50" aria-valuemin="10" aria-valuemax="100" style={expBar}>
                  <span>{prettify(this.props.staff.exp,2)} / {prettify(this.props.staff.nextExp)}</span>
                </div>
              </div>
            }

          </div>
        <div className="col-sm-12">
          <div id={'staffGraduate' + this.props.slot} className="graduate text-center">
            <button onClick={this.graduate} type="button" data-tip="+1 Skill Point" className="btn btn-success btn-lg">
              Graduate
            </button>
          </div>
          <div id={'staffGradBonusArea' + this.props.slot} className="gradBonus text-center">
            <div className="row">
              <div className="col-sm-6">
                <button id={"bonusPerk2_" + this.props.slot} type="button" className="btn btn-success btn-md">
                  +50% Efficient
                </button>
              </div>
              <div className="col-sm-6">
                <button id={"bonusPerk1_" + this.props.slot} type="button" className="btn btn-success btn-md">
                  +50% Faster
                </button>
              </div>
            </div>
          </div>
          <div id={"staffProgressArea" + this.props.slot}>
            <div className="col-sm-8 col-sm-offset-2 col-centered">
              <button onClick={this.startWriting.bind(null, 'words')} id={'staffwords' + this.props.slot} type="button" className="btn btn-primary btn-sm" data-tip="Write Words">W</button>
              <button onClick={this.startWriting.bind(null, 'sentences')} id={'staffsentences' + this.props.slot} type="button" className="btn btn-primary btn-sm" data-tip="Write Sentences">S</button>

              {this.props.staff.prestige >= 2 ?
                <button onClick={this.startWriting.bind(null, 'pages')} id={'staffpages' + this.props.slot} type="button" className="btn btn-primary btn-sm" data-tip="Write Pages">P</button> :
                null
              }
              {this.props.staff.prestige >= 3 ?
                <button onClick={this.startWriting.bind(null, 'chapters')} id={'staffchapters' + this.props.slot} type="button" className="btn btn-primary btn-sm" data-tip="Write Chapters">C</button> :
                null
              }
              {this.props.staff.prestige >= 4 ?
                <button onClick={this.startWriting.bind(null, 'books')} id={'staffbooks' + this.props.slot} type="button" className="btn btn-primary btn-sm" data-tip="Write Books">B</button> :
                null
              }
              {this.props.staff.prestige >= 5 ?
                <button onClick={this.startResearching.bind(null)} id={'staffresearch' + this.props.slot} type="button" className="btn btn-info btn-sm" data-tip="Research">R</button> :
                null
              }
            </div>
            <div className="col-sm-10 col-sm-offset-1">
              <div className="progress">
                <div id={'staffProgress' + this.props.slot} className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="50" aria-valuemin="10" aria-valuemax="100" style={progressBar}>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

let PurchaseStaffSlot = React.createClass({
  render: function() {
    return (
      <div className="col-sm-4 staff-stat">
        <div className="row">
          <button onClick={this.props.hire} type="button" className="btn btn-primary btn-lg centered">
            <p>Hire Staff Member</p>
            <p>{prettify(Math.pow(this.props.slot, 2.3) * 50)} Words</p>
          </button>
        </div>
      </div>
    )
  }
})

let AchievementPanel = React.createClass({
  getInitialState: function() {
    return { ach: save['achievements'] }
  },
  update: function() {
    this.setState({
      ach: save['achievements']
    })
    achieve.check()
  },
  componentDidMount: function() {
    setInterval(this.update, 700)
  },
  render: function() {
    return (
      <div role="tabpanel" className="tab-pane fade" id="achievements">
        <div className="row">
          <div className="col-sm-12 text-center">
            <h3>Work In Progress...</h3>
          </div>
          <div className="col-sm-4 activePerk">
            Active Perk #1
          </div>
          <div className="col-sm-4 activePerk">
            Active Perk #2
          </div>
          <div className="col-sm-4 activePerk">
            Active Perk #3
          </div>
        </div>
        <div className="row">
          <FadedAchievementItem />
        </div>
      </div>
    )
  }
})

let AchievementItem = React.createClass({
  render: function() {
    return (
      <div
        id={this.props.achName.replace(/\s+/g, '')}
        className="col-sm-3 achievement" draggable="true"
      >
        <h4>{this.props.achName}!</h4>
        <small>{this.props.achPerk}</small>
      </div>
    )
  }
})

let FadedAchievementItem = React.createClass({
  render: function() {
    return (
      <div className="col-sm-3 achPlaceholder">
        <h4>Achievement!</h4>
        <small>Perks!</small>
      </div>
    )
  }
})

let OptionsPanel = React.createClass({
  delSave: function() {
    delSave()
  },
  render: function() {
    return (
      <div role="tabpanel" className="tab-pane fade" id="options">
        <div className="row">
          <button onClick={this.delSave} className="btn btn-lg btn-danger">Delete Save</button>
        </div>
      </div>
    )
  }
})

let ChangelogPanel = React.createClass({
  render: function() {
    return (
      <div role="tabpanel" className="tab-pane fade" id="changelog">
        <div className="row">
          <div className="col-sm-12">
            <h3>V0.7.0</h3>
            <ul>
              <li>You can now write books!</li>
              <li>There is an introductory tutorial that explains how to play the game.</li>
              <li>Added 7 new upgrades.</li>
              <li>Laid the groundwork for encyclopedias.</li>
            </ul>
            <h3>V0.6.1</h3>
            <ul>
              <li>Smoothed staff experience. Now includes the multiplier to give slightly more experience.</li>
              <li>Altered staff graduation skill points. Now gives flat +50% instead of multiplier.</li>
              <li>Simple version system. Versions below 1.0 now get deleted with each new version.</li>
              <li>Several new upgrades.</li>
              <li>Switched staff skill point bonuses to match the UI.</li>
            </ul>
            <h3>V0.6.0</h3>
            <ul>
              <li>Fixed rounding error when trying to purchase monkeys.</li>
              <li>Staff continue to write even while they can graduate (although it does not show).</li>
              <li>Hid the game variables to prevent cheating.</li>
              <li>Staff now properly re-calculate 'generating' and 'using' when switching jobs.</li>
              <li>If you have issues, <b>please delete your save!</b></li>
            </ul>
            <h3>V0.5.0</h3>
            <ul>
              <li>Added changelog panel. (thanks <a href="https://www.reddit.com/user/Simon662">/u/Simon662</a>)</li>
              <li>Unit multipliers now work properly.</li>
              <li>LOTS new upgrades!</li>
              <li>Re-wrote some upgrades to calculate bonuses properly.</li>
              <li>Added staff skillpoints. Get an extra boost on level up!</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
})

let ConfirmWindow = React.createClass({
  render: function() {
    return (
      <div>
      <div className="confirmpopopacity"></div>
    	<div className="confirmpop pop">
    		<p id="confirmpopMessage">Are you sure you want to do that?</p>
    		<p>
          <button className="btn btn-lg btn-success confirm">Yes</button>
          <button className="btn btn-lg btn-danger deny">No</button>
        </p>
    	</div>
      </div>
    )
  }
})

let AchievementWindow = React.createClass({
  render: function() {
    return (
      <div className="row achievementWindow centered">
    	<div className="col-sm-12">
    		<div id="achieve" className="alert alert-dismissible alert-success text-center" role="alert">
    			<button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    			<span className="achieveicon glyphicon glyphicon-ok"></span>
    			<h3 id="achieveTitle">Whoa!</h3>
    			<p id="achieveDesc">Looks like you earned an achievement!</p>
    		</div>
    	</div>
    	</div>
    )
  }
})

let TutorialWindow = React.createClass({
  componentDidMount: function() {
    tutorial.setup()
  },
  render: function() {
    return (
    	<div id="tutorialWindow">
  			<h3 id="tutorialTitle">Tutorial Header</h3>
        <button type="button" className="btn btn-success btn-sm" id="tutorialNext">Next</button>
      	<p id="tutorialDesc">This portion explains details for this portion of the tutorial.</p>
    	</div>
    )
  }
})

render(<AuthorSim />, document.getElementById('container'));
